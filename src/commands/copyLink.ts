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
    // Only include line anchors when the user has an active text selection.
    // A cursor with no selection (isEmpty) should open the file without an anchor.
    if (editor.selection.isEmpty) {
        return undefined;
    }
    const startLine = editor.selection.start.line + 1;
    const endLine = editor.selection.end.line + 1;
    return { startLine, endLine };
}

/**
 * Writes a URL to the clipboard and shows a brief confirmation message.
 */
async function copyUrlToClipboard(url: string): Promise<void> {
    await vscode.env.clipboard.writeText(url);
    vscode.window.showInformationMessage(`Copied: ${url}`);
}

/**
 * Builds a GitHub URL pinned to the HEAD commit SHA and copies it to the
 * clipboard.
 */
export async function copyLinkToRemoteHead(explorerUri?: vscode.Uri): Promise<void> {
    const ctx = await getGitContext(explorerUri);
    const selection = getSelectionLines(ctx.fileUri);
    const url = resolveGitHubUrl(ctx.remote, {
        ref: ctx.headCommitSha,
        filePath: ctx.filePath,
        ...selection,
    });
    await copyUrlToClipboard(url);
}

/**
 * Prompts the user to pick a remote branch, then copies a GitHub URL for the
 * file at that ref to the clipboard.
 */
export async function copyLinkToRemoteBranch(explorerUri?: vscode.Uri): Promise<void> {
    const ctx = await getGitContext(explorerUri);

    const branches = await getRemoteBranches(ctx.repo);
    if (branches.length === 0) {
        throw new Error(
            "No remote-tracking branches found. " +
                "Run `git fetch` to update remote refs and try again."
        );
    }

    const picked = await vscode.window.showQuickPick(branches, {
        title: "Copy Link to Remote — Choose Branch",
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
    await copyUrlToClipboard(url);
}
