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

async function handleSubmit(request, env) {
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

  const cleaned = Object.fromEntries(
    Object.entries(submission).filter(([, v]) => v !== '' && v != null)
  );

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
        client_payload: { submission: JSON.stringify(cleaned) },
      }),
    },
  );

  if (!res.ok) {
    const errorBody = await res.text();
    console.error(`GitHub API ${res.status}: ${errorBody}`);
    return Response.json(
      { error: 'Failed to create listing', status: res.status, detail: errorBody },
      { status: 502, headers: corsHeaders(request) },
    );
  }

  return Response.json({ ok: true }, { headers: corsHeaders(request) });
}

async function handleSubscribe(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: 'Invalid JSON' },
      { status: 400, headers: corsHeaders(request) },
    );
  }

  if (!body.email) {
    return Response.json(
      { error: 'Email is required' },
      { status: 400, headers: corsHeaders(request) },
    );
  }

  const auth = btoa(`${env.LISTMONK_USER}:${env.LISTMONK_PASS}`);
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${auth}`,
  };
  const listId = parseInt(env.LISTMONK_LIST_ID);

  const createRes = await fetch(`${env.LISTMONK_URL}/api/subscribers`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      email: body.email,
      name: body.email.split('@')[0],
      status: 'enabled',
      lists: [listId],
      preconfirm_subscriptions: true,
    }),
  });

  if (!createRes.ok) {
    const text = await createRes.text();
    if (text.includes('already exists')) {
      return Response.json({ ok: true }, { headers: corsHeaders(request) });
    }
    console.error(`Listmonk API ${createRes.status}: ${text}`);
    return Response.json(
      { error: 'Subscription failed' },
      { status: 502, headers: corsHeaders(request) },
    );
  }

  return Response.json({ ok: true }, { headers: corsHeaders(request) });
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

    const url = new URL(request.url);

    if (url.pathname === '/subscribe') {
      return handleSubscribe(request, env);
    }

    return handleSubmit(request, env);
  },
};
