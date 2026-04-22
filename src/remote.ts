import type { Remote } from "./vendor/git";

/**
 * Parsed representation of a GitHub repository, extracted from a git remote URL.
 */
interface GitHubRepo {
    /** e.g. "treetrum" */
    owner: string;
    /** e.g. "open-on-remote-ext" (no .git suffix) */
    name: string;
}

/**
 * Options for building a GitHub "blob" URL.
 */
export interface BuildUrlOptions {
    /** The git ref to link to — either a commit SHA or a branch name. */
    ref: string;
    /** Repo-root-relative POSIX path, e.g. "src/extension.ts". */
    filePath: string;
    /** 1-based start line. When undefined the URL has no line anchor. */
    startLine?: number;
    /** 1-based end line. Omitted when equal to startLine or when startLine is undefined. */
    endLine?: number;
}

/**
 * Attempts to parse a git remote URL into its GitHub owner and repo name.
 *
 * Handles both forms:
 *   - HTTPS: https://github.com/owner/repo.git
 *   - SSH:   git@github.com:owner/repo.git
 *
 * Returns null if the URL does not match a GitHub remote.
 */
export function parseGitHubRemoteUrl(url: string): GitHubRepo | null {
    // HTTPS: https://github.com/owner/repo(.git)?
    const httpsMatch = url.match(
        /^https?:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?\/?$/
    );
    if (httpsMatch) {
        return { owner: httpsMatch[1], name: httpsMatch[2] };
    }

    // SSH: git@github.com:owner/repo(.git)?
    const sshMatch = url.match(
        /^git@github\.com:([^/]+)\/([^/]+?)(?:\.git)?\/?$/
    );
    if (sshMatch) {
        return { owner: sshMatch[1], name: sshMatch[2] };
    }

    return null;
}

/**
 * Builds a GitHub "blob" URL for a specific file and ref, with an optional
 * line anchor for the current selection.
 *
 * Examples:
 *   https://github.com/treetrum/repo/blob/a1b2c3d/src/index.ts
 *   https://github.com/treetrum/repo/blob/a1b2c3d/src/index.ts#L10
 *   https://github.com/treetrum/repo/blob/a1b2c3d/src/index.ts#L10-L25
 */
export function buildGitHubUrl(
    repo: GitHubRepo,
    options: BuildUrlOptions
): string {
    const { ref, filePath, startLine, endLine } = options;
    const base = `https://github.com/${repo.owner}/${repo.name}/blob/${ref}/${filePath}`;

    if (startLine === undefined) {
        return base;
    }

    // Single line or cursor-only position.
    if (endLine === undefined || endLine === startLine) {
        return `${base}#L${startLine}`;
    }

    return `${base}#L${startLine}-L${endLine}`;
}

/**
 * Resolves a GitHub URL from a VS Code git Remote and file/selection details.
 *
 * Throws a descriptive error when the remote URL is not a recognised GitHub URL
 * (e.g. it points to GitLab, Bitbucket, or an internal self-hosted instance).
 */
export function resolveGitHubUrl(
    remote: Remote,
    options: BuildUrlOptions
): string {
    const remoteUrl = remote.fetchUrl ?? remote.pushUrl;
    if (!remoteUrl) {
        throw new Error(
            `Remote "${remote.name}" has no fetch or push URL configured.`
        );
    }

    const parsed = parseGitHubRemoteUrl(remoteUrl);
    if (!parsed) {
        throw new Error(
            `Remote URL "${remoteUrl}" does not appear to be a GitHub repository. ` +
                "Only github.com remotes are currently supported."
        );
    }

    return buildGitHubUrl(parsed, options);
}
