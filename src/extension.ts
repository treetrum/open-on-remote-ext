import * as vscode from "vscode";
import {
    openFileOnRemoteHead,
    openFileOnRemoteBranch,
} from "./commands/openOnRemote";
import {
    copyLinkToRemoteHead,
    copyLinkToRemoteBranch,
} from "./commands/copyLink";

/**
 * Wraps a command handler so that any thrown error is surfaced as a VS Code
 * error notification rather than silently swallowed by the extension host.
 */
function withErrorHandler(
    fn: () => Promise<void>
): () => Promise<void> {
    return async () => {
        try {
            await fn();
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
            "openOnRemote.openFileHead",
            withErrorHandler(openFileOnRemoteHead)
        ),
        vscode.commands.registerCommand(
            "openOnRemote.openFileBranch",
            withErrorHandler(openFileOnRemoteBranch)
        ),
        vscode.commands.registerCommand(
            "openOnRemote.copyLinkHead",
            withErrorHandler(copyLinkToRemoteHead)
        ),
        vscode.commands.registerCommand(
            "openOnRemote.copyLinkBranch",
            withErrorHandler(copyLinkToRemoteBranch)
        )
    );
}

export function deactivate(): void {
    // Nothing to clean up — all disposables are handled via context.subscriptions.
}
