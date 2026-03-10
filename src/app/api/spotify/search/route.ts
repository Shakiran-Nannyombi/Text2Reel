import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!client_id || !client_secret || client_id.includes('your_spotify')) {
        return NextResponse.json({ error: 'Spotify API credentials not configured.' }, { status: 501 });
    }

    try {
        // 1. Get Client Credentials Token
        const authString = Buffer.from(client_id + ':' + client_secret).toString('base64');
        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${authString}`,
            },
            body: 'grant_type=client_credentials',
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error("Spotify Auth Error:", tokenData);
            return NextResponse.json({ error: 'Failed to authenticate with Spotify' }, { status: 500 });
        }

        // 2. Search Tracks
        const searchResponse = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query || 'cinematic')}&type=track&limit=10`, {
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`
            }
        });

        const searchData = await searchResponse.json();
        return NextResponse.json(searchData.tracks.items);
    } catch (error) {
        console.error("Spotify API Error:", error);
        return NextResponse.json({ error: 'Internal server error while calling Spotify' }, { status: 500 });
    }
}
