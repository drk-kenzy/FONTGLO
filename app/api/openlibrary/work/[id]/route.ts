import { NextResponse } from "next/server";
import { getWorkDetails, getWorkEditions } from '@/lib/openLibrary';

const cache = new Map<string, { data: any; expires: number }>();
const TTL = 1000 * 60 * 5; // 5 minutes

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const url = new URL(request.url);
    const include = url.searchParams.get('include') || '';
    const page = Number(url.searchParams.get('page') || '1');
    const key = `${id}|${include}|${page}`;
    const now = Date.now();

    const cached = cache.get(key);
    if (cached && cached.expires > now) {
      return NextResponse.json(cached.data);
    }

    const work = await getWorkDetails(id);
    let editions = null;

    if (include.includes('editions')) {
      editions = await getWorkEditions(id, page, 20);
    }

    const payload = { work, editions };
    cache.set(key, { data: payload, expires: Date.now() + TTL });

    return NextResponse.json(payload);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
