# @four-bytes/opencode-plugin-lib

Shared utilities for [opencode](https://opencode.ai) plugins.

## Install

```bash
npm install @four-bytes/opencode-plugin-lib
```

## Usage

```ts
import { createToast } from "@four-bytes/opencode-plugin-lib";
import type { PluginInput } from "@opencode-ai/plugin";

const _serverPlugin = async (input: PluginInput) => {
  const toast = createToast(input.client, "My Plugin 🚀");
  toast("Operation complete", "success");
};
```

## API

### `createToast(client, defaultTitle)`

Creates a toast function bound to a plugin client. Silently swallows all errors — never breaks plugin operation on UI failure.

Returns: `(message: string, variant?: "info" | "success" | "warning" | "error", title?: string) => void`

## License

Apache-2.0
