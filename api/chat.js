// api/chat.js
export default async function handler(req, res) {
  // 1. Configure CORS Headers manually
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle browser preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API Key missing on Vercel Dashboard.' });
    }

    const googleUrl = `https://googleapis.com{apiKey}`;

    // 2. Safely capture the body payload regardless of how Vercel passes it
    const requestData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    // 3. Forward the clean ChatHistory object straight to Google
    const response = await fetch(googleUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: requestData.contents })
    });

    const data = await response.json();

    // 4. Return the response object directly back to your script.js
    return res.status(response.status).json(data);

  } catch (error) {
    console.error("Proxy Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
