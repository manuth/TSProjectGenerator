import { src, dest, parallel } from "gulp";
import { join } from "upath";
import ApplyPatch = require("./.gulp/ApplyPatch");

let projectGeneratorName = "generator-ts-project";

/**
 * Creates a path relative to the gulp-folder.
 *
 * @param path
 * The path to join.
 *
 * @returns
 * The `path` relative to the gulp-folder.
 */
function GulpPath(...path: string[]): string
{
    return join(__dirname, ".gulp", ...path);
}

/**
 * Creates a path relative to the `packages`-folder.
 *
 * @param path
 * The path to join.
 *
 * @returns
 * The `path` relative to the `packages`-folder.
 */
function PackagePath(...path: string[]): string
{
    return join(__dirname, "packages", ...path);
}

/**
 * Copies the `.gitignore` file to the mono-repo packages.
 *
 * @returns
 * The task.
 */
export function CopyGitIgnore(): NodeJS.ReadWriteStream
{
    return src(".gitignore").pipe(
        ApplyPatch(join(GulpPath("gitignore.diff")))
    ).pipe(
        dest(PackagePath(projectGeneratorName))
    );
}

CopyGitIgnore.description = "Copies the `.gitignore` file to the mono-repo packages.";

/**
 * Copies the files to the mono-repo packages.
 */
export let CopyFiles = parallel(
    [
        CopyGitIgnore
    ]);

CopyFiles.description = "Copies the files to the mono-repo packages.";
