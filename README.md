# Open Remote

A lightweight VS Code extension that opens the current file (with optional line selection) on GitHub. A focused replacement for the "open on GitHub" feature from the GitHub Pull Requests extension.

## Commands

Both commands are available from the **command palette** (`Cmd+Shift+P`) and the **file explorer context menu**.

| Command | Description |
|---|---|
| `Open Remote: Open File on Remote` | Opens the file in your browser |
| `Open Remote: Copy Link to Remote` | Copies the URL to your clipboard |

When invoked, a ref picker appears with two options:

- **Current commit (HEAD)** — a permanent permalink to the exact commit (selected by default, press Enter to use it)
- **Branch** — any remote-tracking branch

If you have text selected in the editor, the link will include a line anchor (`#L10` or `#L10-L25`). Line anchors are only added for HEAD permalinks — not branch links, since the file content may differ.

## Requirements

- The file must be inside a git repository with a GitHub remote (`github.com`)
- The built-in VS Code Git extension must be enabled

## Notes

- Only `github.com` remotes are supported (GitLab/Bitbucket not yet supported)
- HEAD links use the commit SHA — they are permanent and won't change as the branch moves
