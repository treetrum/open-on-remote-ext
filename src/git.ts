import * as vscode from "vscode";
import type { API, GitExtension, Repository, Remote } from "./vendor/git";

/**
 * All the git context needed to build a remote URL for the current file.
 */
export interface GitContext {
    /** The repository containing the active file. */
    repo: Repository;
    /** HEAD commit SHA — used for permanent permalink URLs. */
    headCommitSha: string;
    /** The remote to link against (prefers upstream tracking remote, falls back to origin). */
    remote: Remote;
    /** Repo-root-relative POSIX path of the active file, e.g. "src/index.ts". */
    filePath: string;
}

/**
 * Returns the initialised VS Code Git extension API (version 1), or throws
 * a user-friendly error if the built-in git extension is unavailable.
 */
function getGitApi(): API {
    const ext = vscode.extensions.getExtension<GitExtension>("vscode.git");
    if (!ext) {
        throw new Error("The built-in VS Code Git extension could not be found.");
    }
    if (!ext.isActive) {
        throw new Error(
            "The built-in VS Code Git extension is not active. Try again in a moment."
        );
    }
    const gitExtension = ext.exports;
    if (!gitExtension.enabled) {
        throw new Error(
            "Git is disabled. Enable it in VS Code settings (git.enabled) and try again."
        );
    }
    return gitExtension.getAPI(1);
}

/**
 * Resolves the best remote to use for a repository:
 *  1. The remote that tracks the current branch's upstream.
 *  2. The remote named "origin".
 *  3. The first available remote.
 *
 * Throws if no remotes are configured.
 */
function resolveRemote(repo: Repository): Remote {
    const remotes = repo.state.remotes;
    if (remotes.length === 0) {
        throw new Error(
            "No git remotes are configured for this repository. " +
                "Add a remote (e.g. git remote add origin <url>) and try again."
        );
    }

    const upstreamRemoteName = repo.state.HEAD?.upstream?.remote;
    const remote =
        remotes.find((r) => r.name === upstreamRemoteName) ??
        remotes.find((r) => r.name === "origin") ??
        remotes[0];

    return remote;
}

/**
 * Returns the repo-root-relative POSIX path for the given file URI within a
 * repository, e.g. "src/utils/helper.ts".
 *
 * Throws if the file does not belong to the repository root.
 */
function getRepoRelativePath(repo: Repository, fileUri: vscode.Uri): string {
    const repoRoot = repo.rootUri.fsPath;
    const fileFsPath = fileUri.fsPath;

    if (!fileFsPath.startsWith(repoRoot)) {
        throw new Error(
            `File "${fileFsPath}" does not appear to be inside the repository root "${repoRoot}".`
        );
    }

    // Strip the repo root and normalise to POSIX separators (important on Windows).
    const relative = fileFsPath
        .slice(repoRoot.length)
        .replace(/\\/g, "/")
        .replace(/^\//, "");

    return relative;
}

/**
 * Gathers all git context required to build a remote link for the currently
 * active text editor file.
 *
 * Throws a descriptive error if any prerequisite is missing (no open editor,
 * no git repo, no remotes, detached HEAD with no commit, etc.).
 */
export async function getGitContext(): Promise<GitContext> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        throw new Error("No active editor. Open a file and try again.");
    }

    const { document } = editor;
    if (document.isUntitled) {
        throw new Error("The file has not been saved yet — it has no path.");
    }

    const api = getGitApi();

    const repo = api.getRepository(document.uri);
    if (!repo) {
        throw new Error(
            "The current file does not belong to a git repository."
        );
    }

    const headCommitSha = repo.state.HEAD?.commit;
    if (!headCommitSha) {
        throw new Error(
            "Could not determine the HEAD commit SHA. " +
                "The repository may have no commits yet."
        );
    }

    const remote = resolveRemote(repo);
    const filePath = getRepoRelativePath(repo, document.uri);

    return { repo, headCommitSha, remote, filePath };
}

/**
 * Returns all remote-tracking branch names for a repository, stripped of
 * their remote prefix, e.g. ["main", "develop", "feature/foo"].
 *
 * Used to populate the branch picker for "Choose Branch" commands.
 */
export async function getRemoteBranches(repo: Repository): Promise<string[]> {
    const refs = await repo.getBranches({ remote: true });
    return refs
        .map((ref) => ref.name)
        .filter((name): name is string => name !== undefined)
        .map((name) => {
            // Remote refs are prefixed with "<remote>/", e.g. "origin/main".
            // Strip that prefix so the picker shows clean branch names.
            const slashIndex = name.indexOf("/");
            return slashIndex !== -1 ? name.slice(slashIndex + 1) : name;
        })
        .filter((name) => name !== "HEAD")
        .sort();
}
