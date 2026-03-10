import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    const access_key = process.env.UNSPLASH_ACCESS_KEY;

    if (!access_key || access_key.includes('your_unsplash')) {
        return NextResponse.json({ error: 'Unsplash API credentials not configured.' }, { status: 501 });
    }

    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query || 'cinematic')}&per_page=10`, {
            headers: {
                'Authorization': `Client-ID ${access_key}`
            }
        });

        const data = await response.json();
        if (!response.ok) {
            console.error("Unsplash Error:", data);
            return NextResponse.json({ error: 'Failed to query Unsplash' }, { status: 500 });
        }

        return NextResponse.json(data.results);
    } catch (error) {
        console.error("Unsplash API Error:", error);
        return NextResponse.json({ error: 'Internal server error while calling Unsplash' }, { status: 500 });
    }
}
