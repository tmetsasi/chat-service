import { serve } from "https://deno.land/std@0.120.0/http/server.ts";
import { configure, renderFile } from "https://deno.land/x/eta@v1.12.3/mod.ts";
import * as messageService from "./services/messageService.js";

configure({
  views: `${Deno.cwd()}/views/`,
});

const responseDetails = {
  headers: { "Content-Type": "text/html;charset=UTF-8" },
};

const redirectTo = (path) => {
  return new Response(`Redirecting to ${path}.`, {
    status: 303,
    headers: {
      "Location": path,
    },
  });
};

const deleteMessages = async (request) => {
  const url = new URL(request.url);
  const parts = url.pathname.split("/");
  const id = parts[2];
  await messageService.deleteById(id);

  
};

const listMessages = async () => {
  const data = {
    messages: await messageService.findLastFiveMessages(),
  };

  return new Response(await renderFile("index.eta", data), responseDetails);
};

const addMessage = async (request) => {
  const formData = await request.formData();
  const sender = formData.get("sender");
  const message = formData.get("message");

  await messageService.create(sender, message);
  
};

const handleRequest = async (request) => {
  const url = new URL(request.url);
  if (request.method === "POST" && url.pathname.includes("delete")) {
    await deleteMessages(request);
  } else if (request.method === "POST") {
    await addMessage(request);
  } else {
    return await listMessages(request);
  }
  return redirectTo("/")
};

let port = 7777;
if (Deno.args.length > 0) {
  const lastArgument = Deno.args[Deno.args.length - 1];
  port = Number(lastArgument);
}

serve(handleRequest, { port: port });

