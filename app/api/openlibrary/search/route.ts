import { NextResponse } from "next/server";

const cache = new Map<string, { data: any; expires: number }>();
const TTL = 60 * 1000; // 60s

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    const page = url.searchParams.get("page") || "1";
    const limit = url.searchParams.get("limit") || "20";

    if (!q)
      return NextResponse.json({ error: "Missing query q" }, { status: 400 });

    const key = `${q}|${page}|${limit}`;
    const now = Date.now();

    const cached = cache.get(key);
    if (cached && cached.expires > now) {
      return NextResponse.json(cached.data);
    }

    const params = new URLSearchParams({ q: q, page, limit });
    const res = await fetch(`https://openlibrary.org/search.json?${params}`);
    if (!res.ok)
      return NextResponse.json(
        { error: "OpenLibrary fetch failed" },
        { status: 502 },
      );
    const data = await res.json();

    const payload = { numFound: data.numFound, docs: data.docs };
    cache.set(key, { data: payload, expires: Date.now() + TTL });

    return NextResponse.json(payload);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
