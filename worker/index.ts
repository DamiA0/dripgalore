// DripGalore back end (Cloudflare Worker).
// Handles everything under /api/. The website itself is served as static files.

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Simple check that the back end is running
    if (url.pathname === "/api/health") {
      return Response.json({ ok: true, service: "dripgalore-api", time: new Date().toISOString() });
    }

    return Response.json({ error: "Not found" }, { status: 404 });
  },
} satisfies ExportedHandler;