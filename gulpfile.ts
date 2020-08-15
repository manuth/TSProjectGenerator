import glob = require("glob");
import { src, dest, parallel } from "gulp";
import merge = require("merge-stream");
import { join } from "upath";
import ApplyPatch = require("./.gulp/ApplyPatch");

let projectGeneratorName = "generator-ts-project";
let npmIgnoreFile = ".npmignore";
let gitIgnoreFile = ".gitignore";
let gitDiffFile = GulpPath("gitignore.diff");
let npmDiffFile = CommonTemplatePath("npmignore.diff");

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
 * Creates a path relative to the common template folder.
 *
 * @param path
 * The path to join.
 *
 * @returns
 * The `path` relative to the common template folder.
 */
function CommonTemplatePath(...path: string[]): string
{
    return PackagePath(projectGeneratorName, "templates", ...path);
}

/**
 * Copies the files to the mono-repo packages.
 */
export let CopyFiles = parallel(
    [
        CopyGitIgnore,
        CopyNPMIgnore
    ]);

CopyFiles.description = "Copies the files to the mono-repo packages.";

/**
 * Copies the `.gitignore` file to the mono-repo packages.
 *
 * @returns
 * The task.
 */
export function CopyGitIgnore(): NodeJS.ReadWriteStream
{
    return src(gitIgnoreFile).pipe(
        ApplyPatch(gitDiffFile)
    ).pipe(
        dest(PackagePath(projectGeneratorName))
    );
}

CopyGitIgnore.description = `Copies the \`${gitIgnoreFile}\` file to the mono-repo packages.`;

/**
 * Copies the `.npmignore` file to the mono-repo packages.
 *
 * @returns
 * The task.
 */
export function CopyNPMIgnore(): NodeJS.ReadWriteStream
{
    let ignoreFile = src(npmIgnoreFile);
    let streams: NodeJS.ReadWriteStream[] = [];

    for (let folder of glob.sync(PackagePath(`!(${projectGeneratorName})`)))
    {
        streams.push(
            ignoreFile.pipe(
                ApplyPatch(npmDiffFile)
            ).pipe(dest(folder)));
    }

    streams.push(ignoreFile.pipe(dest(PackagePath(projectGeneratorName))));
    return merge(streams);
}

CopyNPMIgnore.description = `Copies the \`${npmIgnoreFile}\` file to the mono-repo packages.`;
