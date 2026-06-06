// api/chat.js
export default async function handler(req, res) {
    // 1. Allow your frontend to communicate with this function cleanly
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 2. Reject anything that isn't a POST request
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // 3. Vercel will safely inject this environment variable in the cloud
        const apiKey = process.env.GEMINI_API_KEY; 
        const googleUrl = `https://googleapis.com{apiKey}`;

        // 4. Forward the frontend's chat logs directly to Gemini
        const response = await fetch(googleUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
    