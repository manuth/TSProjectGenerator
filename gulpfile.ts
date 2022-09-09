import { EOL } from "node:os";
import { fileURLToPath } from "node:url";
import G from "glob";
import GulpClient from "gulp";
import rename from "gulp-rename";
import replace from "gulp-replace";
import merge from "merge-stream";
import minimist from "minimist";
import upath from "upath";
import { ApplyPatch } from "./gulp/ApplyPatch.js";
import "./gulp/TaskFunction.js";

const { glob } = G;
const { dest, parallel, series, src, watch } = GulpClient;
const { basename, join, relative } = upath;

let dirName = fileURLToPath(new URL(".", import.meta.url));
let projectGeneratorName = "generator-ts-project";
let customProjectGeneratorName = "generator-my-ts-project";
let gitIgnoreFile = join(dirName, ".gitignore");
let npmIgnoreFile = join(dirName, ".npmignore");
let droneFile = join(dirName, ".drone.yml");
let changelogFile = join(dirName, "CHANGELOG.md");
let licenseFile = join(dirName, "LICENSE");
let gitDiffFile = GulpPath("gitignore.diff");
let npmDiffFile = CommonTemplatePath(projectGeneratorName, "npmignore.diff");
let customNPMDiffFile = GulpPath("npmignore.diff");
let dotGitHubDir = join(dirName, ".github");
let workflowsDir = join(dotGitHubDir, "workflows");
let options = minimist(process.argv.slice(2), { boolean: "watch" });

/**
 * Creates a path relative to the gulp-folder.
 *
 * @param path
 * The path to join.
 *
 * @returns
 * The specified {@link path `path`} relative to the gulp-folder.
 */
function GulpPath(...path: string[]): string
{
    return join(dirName, "gulp", ...path);
}

/**
 * Creates a path relative to the `packages`-folder.
 *
 * @param path
 * The path to join.
 *
 * @returns
 * The specified {@link path `path`} relative to the `packages`-folder.
 */
function PackagePath(...path: string[]): string
{
    return join(dirName, "packages", ...path);
}

/**
 * Creates a path relative to the common template folder.
 *
 * @param generatorName
 * The name of the generator containing the common templates.
 *
 * @param path
 * The path to join.
 *
 * @returns
 * The specified {@link path `path`} relative to the common template folder.
 */
function CommonTemplatePath(generatorName: string, ...path: string[]): string
{
    return PackagePath(generatorName, "templates", ...path);
}

/**
 * Copies the files to the mono-repo packages.
 */
export let CopyFiles =
    series(
        [
            parallel(
                [
                    CopyGitIgnore,
                    CopyNPMIgnore,
                    CopyDroneFile,
                    CopyChangelogFile,
                    CopyLicenseFile,
                    CopyWorkflows
                ]),
            ...(
                options.watch ?
                    [
                        function WatchFiles()
                        {
                            watch(
                                [
                                    gitIgnoreFile,
                                    gitDiffFile
                                ],
                                CopyGitIgnore);

                            watch(
                                [
                                    npmIgnoreFile,
                                    npmDiffFile,
                                    customNPMDiffFile
                                ],
                                CopyNPMIgnore);

                            watch(
                                [
                                    droneFile
                                ],
                                CopyDroneFile);

                            watch(
                                [
                                    changelogFile
                                ],
                                CopyChangelogFile);

                            watch(
                                [
                                    licenseFile
                                ],
                                CopyLicenseFile);

                            watch(
                                [
                                    join(workflowsDir, "**")
                                ],
                                CopyWorkflows);
                        }
                    ] :
                    [])
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
        rename(
            {
                suffix: ".ejs"
            })
    ).pipe(
        dest(CommonTemplatePath(projectGeneratorName))
    );
}

CopyGitIgnore.description = `Copies the \`${basename(gitIgnoreFile)}\` file to the mono-repo packages.`;

/**
 * Copies the `.npmignore` file to the mono-repo packages.
 *
 * @returns
 * The task.
 */
export function CopyNPMIgnore(): NodeJS.ReadWriteStream
{
    let ignoreFile = (): NodeJS.ReadWriteStream => src(npmIgnoreFile);
    let streams: NodeJS.ReadWriteStream[] = [];

    for (let folder of glob.sync(PackagePath("*")))
    {
        let stream = ignoreFile();
        let packageName = basename(folder);

        if (packageName !== projectGeneratorName)
        {
            stream = stream.pipe(
                ApplyPatch(npmDiffFile));

            if (packageName === customProjectGeneratorName)
            {
                stream = stream.pipe(
                    ApplyPatch(customNPMDiffFile));
            }
        }

        streams.push(stream.pipe(dest(folder)));
    }

    return merge(streams);
}

CopyNPMIgnore.description = `Copies the \`${basename(npmIgnoreFile)}\` file to the mono-repo packages.`;

/**
 * Copies the `.drone.yml` file to the mono-repo packages.
 *
 * @returns
 * The task.
 */
export function CopyDroneFile(): NodeJS.ReadWriteStream
{
    return src(droneFile).pipe(dest(PackagePath(customProjectGeneratorName)));
}

CopyDroneFile.description = `Copies the \`${basename(droneFile)}\` file to the mono-repo packages.`;

/**
 * Copies the `CHANGELOG` file to the mono-repo packages.
 *
 * @returns
 * The task.
 */
export function CopyChangelogFile(): NodeJS.ReadWriteStream
{
    return src(changelogFile).pipe(
        replace(
            /(# Changelog)([\s\S]*?[\n$])##[\s\S]*$/g,
            [
                "$1",
                "$2## <%- Name %> [Unreleased]",
                "",
                "- Initial release",
                ""
            ].join(EOL)
        )).pipe(
            rename(
                (parsed) =>
                {
                    parsed.extname += ".ejs";
                })
        ).pipe(
            dest(CommonTemplatePath(projectGeneratorName))
        );
}

/**
 * Copies the `LICENSE` file to the mono-repo packages.
 *
 * @returns
 * The task.
 */
export function CopyLicenseFile(): NodeJS.ReadWriteStream
{
    let source = (): NodeJS.ReadWriteStream => src(licenseFile);
    let streams: NodeJS.ReadWriteStream[] = [];

    for (let folder of glob.sync(PackagePath("*")))
    {
        streams.push(source().pipe(dest(folder)));
    }

    return merge(streams);
}

CopyLicenseFile.description = `Copies the \`${basename(licenseFile)}\` file to the mono-repo packages.`;

/**
 * Copies the workflows to the proper package.
 *
 * @returns
 * The task.
 */
export function CopyWorkflows(): NodeJS.ReadWriteStream
{
    return src(join(workflowsDir, "**")).pipe(dest(CommonTemplatePath(customProjectGeneratorName, relative(dirName, workflowsDir))));
}

CopyWorkflows.description = "Copies the workflows to the proper package.";
