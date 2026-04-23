import * as vscode from "vscode";
import { getGitContext, pickRef } from "../git";
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
 * Prompts the user to pick a ref (defaulting to HEAD commit SHA), then copies
 * a GitHub URL for the file at that ref to the clipboard.
 */
export async function copyLinkToRemote(explorerUri?: vscode.Uri): Promise<void> {
    const ctx = await getGitContext(explorerUri);

    const picked = await pickRef(ctx, "Copy Link to Remote");
    if (picked === undefined) {
        return;
    }

    const selection = getSelectionLines(ctx.fileUri);
    const url = resolveGitHubUrl(ctx.remote, {
        ref: picked.ref,
        filePath: ctx.filePath,
        ...selection,
    });
    await copyUrlToClipboard(url);
}
