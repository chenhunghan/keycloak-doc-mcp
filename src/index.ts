#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
  name: "Keycloak Documentation and Release Logs",
  version: "0.0.1",
});

server.resource("readme", "docs://readme", async (uri) => {
  const res = await fetch(
    "https://raw.githubusercontent.com/keycloak/keycloak/refs/heads/main/README.md",
  );
  const text = await res.text();
  return { contents: [{ uri: uri.href, text }] };
});

const transport = new StdioServerTransport();
await server.connect(transport);
