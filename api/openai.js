export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: {
        code: 'missing_server_api_key',
        message: 'OPENAI_API_KEY is not configured on the server.'
      }
    });
  }

  // 이 앱에서 사용하는 요청만 전달하고, 서버 설정 모델이 있으면 그것을 우선합니다.
  const incoming = req.body && typeof req.body === 'object' ? req.body : {};
  const body = {
    ...incoming,
    model: process.env.OPENAI_MODEL || incoming.model || 'gpt-6.1-sol',
    store: false
  };

  // 과도한 임의 호출을 조금이라도 제한합니다. 실제 공개 서비스라면 Vercel 보호/인증도 추가하세요.
  if (typeof body.max_output_tokens === 'number') {
    body.max_output_tokens = Math.min(Math.max(body.max_output_tokens, 1), 24000);
  }

  try {
    const upstream = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });

    const text = await upstream.text();
    res.status(upstream.status);
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    return res.send(text);
  } catch (error) {
    return res.status(502).json({
      error: {
        code: 'openai_proxy_error',
        message: 'OpenAI API request failed on the server.'
      }
    });
  }
}
