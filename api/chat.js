// api/chat.js
export const config = {
  runtime: 'edge', // 🚀 Forces Vercel to use the high-speed Web Edge Runtime
};

export default async function handler(req) {
  // 1. Handle CORS Preflight Requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API Key missing on server' }), { status: 500 });
    }

    const googleUrl = `https://googleapis.com{apiKey}`;
    
    // 2. Read the raw text stream straight from your frontend fetch request
    const bodyText = await req.text();

    // 3. Forward the exact payload safely directly to Google Gemini
    const response = await fetch(googleUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: bodyText,
    });

    const data = await response.json();

    // 4. Return the response back to your client-side JavaScript UI
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
