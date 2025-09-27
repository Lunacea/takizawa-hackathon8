const PORT = Number(process.env.PORT ?? 3000);

const server = Bun.serve({
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/healthz") {
      return new Response("ok", { status: 200 });
    }
    return new Response("Hello from Bun server", {
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  },
});

console.log(`Server listening on http://localhost:${server.port}`);
