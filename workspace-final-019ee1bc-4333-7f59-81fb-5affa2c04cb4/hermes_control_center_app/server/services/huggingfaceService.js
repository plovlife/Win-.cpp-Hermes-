async function testHuggingFaceConnection() {
  const token = process.env.HF_TOKEN;
  const model = process.env.HF_DEFAULT_MODEL || 'gpt2';

  if (!token) {
    return {
      configured: false,
      ok: false,
      message: 'HF_TOKEN ist nicht gesetzt.'
    };
  }

  const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      inputs: 'Hello from Hermes Control Center'
    })
  });

  let payload = null;
  try {
    payload = await res.json();
  } catch {
    payload = null;
  }

  return {
    configured: true,
    ok: res.ok,
    status: res.status,
    model,
    payload
  };
}

module.exports = {
  testHuggingFaceConnection
};
