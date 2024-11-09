import { Application, Router, send } from "@oak/oak";
import { renderFileToString } from "https://deno.land/x/dejs@0.10.3/mod.ts";

const router = new Router();

//Marble Arena
router.get("/", async (ctx) => {
  const html = await renderFileToString(`${Deno.cwd()}/client/dist/index.ejs`, {
    title: "Hello From Deno", // Pass variables if needed
  });
  ctx.response.body = html;
});

// Route to handle static assets (CSS, JS, etc.) in client folder
router.get("/(.*)", async (ctx) => {
  await send(ctx, ctx.request.url.pathname, {
    root: `${Deno.cwd()}/client/dist`,
  });
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

export function startServer() {
  const port = parseInt(Deno.env.get("PORT")!) || 8000;
  app.listen({ port });

  console.log(`Server running on port ${port}`);
}
