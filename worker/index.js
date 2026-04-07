const ALLOWED_ORIGINS = [
  'https://templeofjoy.org',
  'https://www.templeofjoy.org',
  'http://localhost:4321',
  'http://localhost:4322',
];

function corsHeaders(request) {
  const origin = request.headers.get('Origin') || '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(request) });
    }

    if (request.method !== 'POST') {
      return Response.json(
        { error: 'Method not allowed' },
        { status: 405, headers: corsHeaders(request) },
      );
    }

    let submission;
    try {
      submission = await request.json();
    } catch {
      return Response.json(
        { error: 'Invalid JSON' },
        { status: 400, headers: corsHeaders(request) },
      );
    }

    if (!submission.displayName || !submission.country) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400, headers: corsHeaders(request) },
      );
    }

    const res = await fetch(
      'https://api.github.com/repos/momentmaker/templeofjoy/dispatches',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': `Bearer ${env.GITHUB_PAT}`,
          'User-Agent': 'temple-of-joy-worker',
        },
        body: JSON.stringify({
          event_type: 'new-listing',
          client_payload: submission,
        }),
      },
    );

    if (!res.ok) {
      return Response.json(
        { error: 'Failed to create listing' },
        { status: 502, headers: corsHeaders(request) },
      );
    }

    return Response.json(
      { ok: true },
      { headers: corsHeaders(request) },
    );
  },
};
