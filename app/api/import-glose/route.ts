import { NextResponse } from "next/server";
import { getShelfForms, getMultipleForms, getFormById, getBookshelves } from "@/lib/api";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url)
      return NextResponse.json({ error: "Missing url" }, { status: 400 });

    // Basic URL validation and domain allowlist
    let target: URL;
    try {
      target = new URL(url);
    } catch (e) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }
    if (!/(\.|^)glose\.com$/i.test(target.hostname)) {
      return NextResponse.json({ error: "Only glose.com URLs are supported" }, { status: 400 });
    }

    // Fetch the public page with browser-like headers, timeout and redirects
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    let res: Response;
    try {
      res = await fetch(url, {
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
          'Referer': 'https://glose.com/',
          'Cache-Control': 'no-cache',
        },
        signal: controller.signal,
      });
    } catch (e) {
      clearTimeout(timeout);
      const msg = e instanceof Error ? e.message : 'Unknown network error';
      return NextResponse.json({ error: `Network error while fetching URL: ${msg}` }, { status: 502 });
    }
    clearTimeout(timeout);

    if (!res.ok) {
      if (res.status === 401) {
        return NextResponse.json({ error: 'Non autorisé. Cette page nécessite une connexion.' }, { status: 401 });
      }
      if (res.status === 403) {
        return NextResponse.json({ error: 'Accès refusé (403). Glose/Cloudflare bloque l\'accès public à cette page.' }, { status: 403 });
      }
      if (res.status === 404) {
        return NextResponse.json({ error: 'Page introuvable (404). Vérifiez l\'URL.' }, { status: 404 });
      }
      if (res.status >= 500) {
        return NextResponse.json({ error: 'Glose est temporairement indisponible (5xx). Réessayez plus tard.' }, { status: 502 });
      }
      return NextResponse.json({ error: `Échec du chargement: ${res.status} ${res.statusText}` }, { status: 400 });
    }

    const contentType = res.headers.get('content-type') || '';
    const text = await res.text();

    // Detect login/anti-bot pages even with 200 OK
    if (/login|sign\s*in|__cf_chl|cf-browser-verification|captcha/i.test(text)) {
      return NextResponse.json({ error: 'Accès bloqué ou connexion requise sur Glose. Impossible d\'importer cette page.' }, { status: 403 });
    }

    // 1. Try to find if it's a USER profile
    const userMatch =
      text.match(/\/users\/([a-f0-9]{24})/i) ||
      text.match(/data-user-id=["']([a-f0-9]{24})["']/i) ||
      text.match(/"user":\s*{\s*"_id":\s*"([a-f0-9]{24})"/i);

    if (userMatch && url.includes('/u/')) {
      const userId = userMatch[1];
      try {
        const shelvesResp = await getBookshelves(userId, 0, 50);
        return NextResponse.json({
          type: 'user',
          userId,
          shelves: shelvesResp.data,
          count: shelvesResp.data.length
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Unknown error';
        return NextResponse.json({ error: `Erreur lors de la récupération des étagères: ${msg}` }, { status: 502 });
      }
    }

    // Fallback for profile pages: if URL is /u/<username>/books/all and no userId was extracted,
    // try to collect all shelf IDs present on the page and return them as a pseudo-user shelves list
    if (/\/u\/.+\/books\/all\/?$/i.test(url) && !userMatch) {
      const ids = new Set<string>();
      // Global matches for /shelves/<24hex>
      const linkRegex = /\/shelves\/([a-f0-9]{24})/ig;
      let m: RegExpExecArray | null;
      while ((m = linkRegex.exec(text)) !== null) {
        ids.add(m[1]);
      }
      // Global matches for data-shelf-id="<24hex>"
      const dataAttrRegex = /data-shelf-id=["']([a-f0-9]{24})["']/ig;
      while ((m = dataAttrRegex.exec(text)) !== null) {
        ids.add(m[1]);
      }

      const shelfIds = Array.from(ids);
      if (shelfIds.length > 0) {
        const shelves = shelfIds.map((id) => ({
          _id: id,
          name: `Shelf ${id.slice(0, 6)}`,
          description: '',
          formsCount: undefined,
        }));
        return NextResponse.json({
          type: 'user',
          userId: null,
          shelves,
          count: shelves.length,
        });
      }
    }

    // 2. Try to find /shelves/<id>/forms or data-shelf-id="<id>" patterns
    const shelfMatch =
      text.match(/\/shelves\/([a-f0-9]{24})/i) ||
      text.match(/data-shelf-id=["']([a-f0-9]{24})["']/i);

    if (!shelfMatch) {
      // Fallback: maybe the URL is a book page — try multiple patterns to find a form id
      const formPatterns = [
        /\/forms\/([a-f0-9]{24})/i,
        /data-form-id=["']([a-f0-9]{24})["']/i,
        /data-form-id=["']([A-Za-z0-9_-]{24,})["']/i,
        /\/forms\/([A-Za-z0-9_-]{24,})/i,
        /form_id["']?:\s*["']?([a-f0-9]{24})/i,
      ];

      let formMatch = null as RegExpMatchArray | null;
      for (const p of formPatterns) {
        formMatch = text.match(p);
        if (formMatch) break;
      }

      if (formMatch) {
        const formId = formMatch[1];
        try {
          const formResp = await getFormById(formId);
          const book = formResp.data;
          return NextResponse.json({ shelfId: null, count: 1, books: [book], singleFormId: formId });
        } catch (err) {
          return NextResponse.json({ error: 'Could not fetch form details' }, { status: 502 });
        }
      }

      // Helpful message when no shelf/form id found
      const hint = url.includes('/book/')
        ? 'La page semble être une page livre (URL /book/...). Si vous voulez importer l\'étagère contenant ce livre, fournissez l\'URL publique de l\'étagère. J\'essaie aussi d\'importer un seul livre si la page expose un identifiant de formulaire.'
        : 'La page ne contient pas d\'identifiant d\'étagère public. Assurez-vous que l\'étagère est publique et réessayez.';

      return NextResponse.json(
        { error: `Could not find shelf id in page. ${hint}` },
        { status: 400 },
      );
    }

    const shelfId = shelfMatch[1];

    // Fetch forms (ids) then fetch form details
    const formsResponse = await getShelfForms(shelfId, 0, 100);
    const formIds = formsResponse.data;
    const formResponses = await getMultipleForms(formIds);

    const books = formResponses.map((r) => r.data);

    return NextResponse.json({ shelfId, count: books.length, books });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
