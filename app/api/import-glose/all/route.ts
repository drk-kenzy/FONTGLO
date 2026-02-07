import { NextResponse } from "next/server";
import { getBookshelves, getShelfForms } from "@/lib/api";

// Import all shelves for a given Glose username without requiring a URL from the client
// POST /api/import-glose/all { username?: string }
export async function POST(request: Request) {
  try {
    let username = 'MarcOwenHOUNTON';
    try {
      const body = await request.json().catch(() => ({}));
      if (body && typeof body.username === 'string' && body.username.trim()) {
        username = body.username.trim();
      }
    } catch {}

    const url = `https://glose.com/u/${encodeURIComponent(username)}/books/all`;

    // Fetch the profile page to extract userId or fallback to shelf ids from HTML
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
      return NextResponse.json({ error: `Network error while fetching profile: ${msg}` }, { status: 502 });
    }
    clearTimeout(timeout);

    if (!res.ok) {
      if (res.status === 401) return NextResponse.json({ error: 'Non autorisé. Connexion requise.' }, { status: 401 });
      if (res.status === 403) return NextResponse.json({ error: 'Accès refusé (403). Glose/Cloudflare bloque l\'accès public.' }, { status: 403 });
      if (res.status === 404) return NextResponse.json({ error: `Profil introuvable: @${username}` }, { status: 404 });
      if (res.status >= 500) return NextResponse.json({ error: 'Glose indisponible (5xx). Réessayez plus tard.' }, { status: 502 });
      return NextResponse.json({ error: `Échec du chargement: ${res.status} ${res.statusText}` }, { status: 400 });
    }

    const html = await res.text();
    if (/login|sign\s*in|__cf_chl|cf-browser-verification|captcha/i.test(html)) {
      return NextResponse.json({ error: 'Accès bloqué ou connexion requise sur Glose.' }, { status: 403 });
    }

    // Try to extract a userId from the page (extended patterns)
    const userMatch =
      html.match(/\/users\/([a-f0-9]{24})/i) ||
      html.match(/data-user-id=["']([a-f0-9]{24})["']/i) ||
      html.match(/"user"\s*:\s*\{\s*"_id"\s*:\s*"([a-f0-9]{24})"/i) ||
      html.match(/"userId"\s*:\s*"([a-f0-9]{24})"/i) ||
      html.match(/"owner"\s*:\s*\{[^}]*?"_id"\s*:\s*"([a-f0-9]{24})"/is);

    if (userMatch) {
      const userId = userMatch[1];
      try {
        const shelvesResp = await getBookshelves(userId, 0, 100);
        return NextResponse.json({
          type: 'user',
          userId,
          shelves: shelvesResp.data,
          count: shelvesResp.data?.length || 0,
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Unknown error';
        return NextResponse.json({ error: `Erreur API Glose lors de la récupération des étagères: ${msg}` }, { status: 502 });
      }
    }

    // Fallback: collect candidate 24-hex IDs from the whole HTML and validate which are shelves
    const candidateIds = new Set<string>();
    const hex24 = /\b([a-f0-9]{24})\b/ig;
    let mm: RegExpExecArray | null;
    while ((mm = hex24.exec(html)) !== null) candidateIds.add(mm[1]);

    // Also check explicit patterns
    const linkRegex = /\/shelves\/([a-f0-9]{24})/ig;
    while ((mm = linkRegex.exec(html)) !== null) candidateIds.add(mm[1]);
    const dataAttrRegex = /data-shelf-id=["']([a-f0-9]{24})["']/ig;
    while ((mm = dataAttrRegex.exec(html)) !== null) candidateIds.add(mm[1]);

    const candidates = Array.from(candidateIds);

    // Validate candidates by calling the API endpoint for shelf forms; keep the ones that return ok
    const validated: { _id: string; name: string; description: string; formsCount?: number }[] = [];
    for (const id of candidates) {
      try {
        const forms = await getShelfForms(id, 0, 1);
        if (Array.isArray(forms.data)) {
          validated.push({ _id: id, name: `Shelf ${id.slice(0,6)}`, description: '', formsCount: forms.data.length });
        }
      } catch {}
    }

    if (validated.length === 0) {
      return NextResponse.json({ error: `Aucune étagère détectée sur le profil @${username}` }, { status: 404 });
    }

    return NextResponse.json({
      type: 'user',
      userId: null,
      shelves: validated,
      count: validated.length,
    });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
