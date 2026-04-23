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
    // vscode.Selection lines are 0-indexed; convert to 1-based for GitHub.
    const startLine = editor.selection.start.line + 1;
    const endLine = editor.selection.end.line + 1;
    return { startLine, endLine };
}

/**
 * Prompts the user to pick a ref (defaulting to HEAD commit SHA), then opens
 * the file at that ref in the default browser.
 */
export async function openFileOnRemote(explorerUri?: vscode.Uri): Promise<void> {
    const ctx = await getGitContext(explorerUri);

    const picked = await pickRef(ctx, "Open File on Remote");
    if (picked === undefined) {
        return;
    }

    const selection = picked.isHead ? getSelectionLines(ctx.fileUri) : undefined;
    const url = resolveGitHubUrl(ctx.remote, {
        ref: picked.ref,
        filePath: ctx.filePath,
        ...selection,
    });
    await vscode.env.openExternal(vscode.Uri.parse(url));
}
