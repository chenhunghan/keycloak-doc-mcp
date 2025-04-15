#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
  name: "Keycloak Documentation and Release Logs",
  version: "0.0.1",
});

const docs = [
  {
    resourceName: "readme",
    resourceUri: "docs://readme",
    resourceUrl:
      "https://raw.githubusercontent.com/keycloak/keycloak/refs/heads/main/README.md",
  },
];

for (const doc of docs) {
  server.resource(doc.resourceName, doc.resourceUri, async (uri) => {
    const res = await fetch(doc.resourceUrl);
    const text = await res.text();
    return { contents: [{ uri: uri.href, text }] };
  });
}

const transport = new StdioServerTransport();
await server.connect(transport);
