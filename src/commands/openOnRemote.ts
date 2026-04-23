import * as vscode from "vscode";
import { getGitContext, getRemoteBranches } from "../git";
import { resolveGitHubUrl } from "../remote";

/**
 * Builds the selection anchor from the active editor, but only if the active
 * editor is showing the same file we are linking to. When triggered from the
 * explorer context menu the target file may not be the active editor.
 *
 * Returns 1-based line numbers, or undefined when there is no matching editor
 * or no active selection.
 */
function getSelectionLines(
    fileUri: vscode.Uri
): { startLine: number; endLine: number } | undefined {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.uri.fsPath !== fileUri.fsPath) {
        return undefined;
    }
    // vscode.Selection lines are 0-indexed; convert to 1-based for GitHub.
    const startLine = editor.selection.start.line + 1;
    const endLine = editor.selection.end.line + 1;
    return { startLine, endLine };
}

/**
 * Builds a GitHub URL pinned to the HEAD commit SHA and opens it in the
 * default browser.
 */
export async function openFileOnRemoteHead(explorerUri?: vscode.Uri): Promise<void> {
    const ctx = await getGitContext(explorerUri);
    const selection = getSelectionLines(ctx.fileUri);
    const url = resolveGitHubUrl(ctx.remote, {
        ref: ctx.headCommitSha,
        filePath: ctx.filePath,
        ...selection,
    });
    await vscode.env.openExternal(vscode.Uri.parse(url));
}

/**
 * Prompts the user to pick a remote branch, then opens the file at that ref
 * in the default browser.
 */
export async function openFileOnRemoteBranch(explorerUri?: vscode.Uri): Promise<void> {
    const ctx = await getGitContext(explorerUri);

    const branches = await getRemoteBranches(ctx.repo);
    if (branches.length === 0) {
        throw new Error(
            "No remote-tracking branches found. " +
                "Run `git fetch` to update remote refs and try again."
        );
    }

    const picked = await vscode.window.showQuickPick(branches, {
        title: "Open on Remote — Choose Branch",
        placeHolder: "Select a branch…",
    });

    // User dismissed the picker.
    if (picked === undefined) {
        return;
    }

    const selection = getSelectionLines(ctx.fileUri);
    const url = resolveGitHubUrl(ctx.remote, {
        ref: picked,
        filePath: ctx.filePath,
        ...selection,
    });
    await vscode.env.openExternal(vscode.Uri.parse(url));
}
