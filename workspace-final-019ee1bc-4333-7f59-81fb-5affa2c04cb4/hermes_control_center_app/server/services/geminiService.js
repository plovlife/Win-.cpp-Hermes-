async function testGeminiConnection() {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_DEFAULT_MODEL || 'gemini-3.5-flash';

  if (!apiKey) {
    return {
      configured: false,
      ok: false,
      message: 'GEMINI_API_KEY ist nicht gesetzt.'
    };
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'x-goog-api-key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: 'Antworte nur mit dem Satz: Verbindung erfolgreich.' }
          ]
        }
      ]
    })
  });

  const payload = await res.json();
  return {
    configured: true,
    ok: res.ok,
    status: res.status,
    model,
    payload
  };
}

module.exports = {
  testGeminiConnection
};
