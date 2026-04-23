import * as vscode from "vscode";
import { openFileOnRemote } from "./commands/openOnRemote";
import { copyLinkToRemote } from "./commands/copyLink";

/**
 * Wraps a command handler so that any thrown error is surfaced as a VS Code
 * error notification rather than silently swallowed by the extension host.
 */
function withErrorHandler(
    fn: (uri?: vscode.Uri) => Promise<void>
): (uri?: vscode.Uri) => Promise<void> {
    return async (uri?: vscode.Uri) => {
        try {
            await fn(uri);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : String(err);
            vscode.window.showErrorMessage(`Open on Remote: ${message}`);
        }
    };
}

export function activate(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
        vscode.commands.registerCommand(
            "openOnRemote.openFile",
            withErrorHandler(openFileOnRemote)
        ),
        vscode.commands.registerCommand(
            "openOnRemote.copyLink",
            withErrorHandler(copyLinkToRemote)
        )
    );
}

export function deactivate(): void {
    // Nothing to clean up — all disposables are handled via context.subscriptions.
}
