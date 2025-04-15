#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

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
  {
    resourceName: "Service Provider Interfaces (SPI)",
    resourceUri: "docs://spi",
    resourceUrl:
      "https://raw.githubusercontent.com/keycloak/keycloak/refs/heads/main/docs/documentation/server_development/topics/providers.adoc",
    mimeType: "text/asciidoc",
  },
  {
    resourceName: "Keycloak Theme",
    resourceUri: "docs://theme",
    resourceUrl:
      "https://raw.githubusercontent.com/keycloak/keycloak/refs/heads/main/docs/documentation/server_development/topics/themes.adoc",
    mimeType: "text/asciidoc",
  },
  {
    resourceName: "Extending Keycloak Server",
    resourceUri: "docs://extending-keycloak-server",
    resourceUrl:
      "https://raw.githubusercontent.com/keycloak/keycloak/refs/heads/main/docs/documentation/server_development/topics/extensions.adoc",
    mimeType: "text/asciidoc",
  },
  {
    resourceName: "Authentication SPI",
    resourceUri: "docs://authentication-spi",
    resourceUrl:
      "https://raw.githubusercontent.com/keycloak/keycloak/refs/heads/main/docs/documentation/server_development/topics/auth-spi.adoc",
    mimeType: "text/asciidoc",
  },
  {
    resourceName: "Authentication Flows",
    resourceUri: "docs://authentication-flows",
    resourceUrl:
      "https://raw.githubusercontent.com/keycloak/keycloak/refs/heads/main/docs/documentation/server_admin/topics/authentication/flows.adoc",
    mimeType: "text/asciidoc",
  },
];

for (const doc of docs) {
  server.resource(doc.resourceName, doc.resourceUri, async (uri) => {
    try {
      const res = await fetch(doc.resourceUrl);
      const text = await res.text();
      return {
        contents: [
          {
            uri: uri.href,
            text,
            mimeType: doc.mimeType ?? "text/markdown",
            name: doc.resourceName,
          },
        ],
      };
    } catch (error: unknown) {
      return {
        contents: [
          {
            uri: uri.href,
            text: (error as Error)?.message ?? "Failed to fetch",
            mimeType: "text/txt",
            name: doc.resourceName,
          },
        ],
      };
    }
  });
}

server.tool(
  "get-keycloak-release-notes",
  "Get Keycloak's Release Notes with New Features and/or Breaking Changes",
  {
    version: z
      .string()
      .describe(
        "Keycloak version in format [major]_[minor]_[patch]. e.g. `26_2_0`"
      ),
  },
  async ({ version }) => {
    try {
      const res = await fetch(
        `https://raw.githubusercontent.com/keycloak/keycloak/refs/heads/main/docs/documentation/release_notes/topics/${version}.adoc`
      );
      const data = await res.text();
      return {
        content: [
          {
            text: data,
            type: "text",
            name: `${version} Release Notes`,
          },
        ],
      };
    } catch {
      return {
        content: [
          {
            text: `Failed to fetch ${version} Release Notes`,
            type: "text",
            name: "error",
          },
        ],
        isError: true
      };
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
