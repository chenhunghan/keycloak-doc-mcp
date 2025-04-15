# keycloak-doc-mcp

MCP sever for fetching latest Keyclaok documentation in LLM friendly format

## Installation

```sh
$ npm install -g keycloak-doc-mcp
```

## Config

```json
{
  "mcpServers": {
    "keycloak-documentation": {
      "command": "keycloak-doc-mcp",
      "args": [],
      "env": {}
    }
  }
}
```
