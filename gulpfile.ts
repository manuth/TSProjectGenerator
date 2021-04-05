import { EOL } from "os";
import { glob } from "glob";
import { dest, parallel, series, src, watch } from "gulp";
import rename = require("gulp-rename");
import replace = require("gulp-replace");
import merge = require("merge-stream");
import minimist = require("minimist");
import { basename, dirname, join, relative } from "upath";
import { ApplyPatch } from "./gulp/ApplyPatch";
import "./gulp/TaskFunction";

let projectGeneratorName = "generator-ts-project";
let customProjectGeneratorName = "generator-my-ts-project";
let gitIgnoreFile = join(__dirname, ".gitignore");
let npmIgnoreFile = join(__dirname, ".npmignore");
let droneFile = join(__dirname, ".drone.yml");
let changelogFile = join(__dirname, "CHANGELOG.md");
let licenseFile = join(__dirname, "LICENSE");
let gitDiffFile = GulpPath("gitignore.diff");
let npmDiffFile = CommonTemplatePath(projectGeneratorName, "npmignore.diff");
let customNPMDiffFile = GulpPath("npmignore.diff");
let dotGitHubDir = join(__dirname, ".github");
let dependabotFile = join(dotGitHubDir, "dependabot.yml");
let workflowsDir = join(dotGitHubDir, "workflows");
let options = minimist(process.argv.slice(2), { boolean: "watch" });

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
    return join(__dirname, "gulp", ...path);
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
 * @param generatorName
 * The name of the generator containing the common templates.
 *
 * @param path
 * The path to join.
 *
 * @returns
 * The `path` relative to the common template folder.
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
                    CopyDependabotFile,
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
                                    dependabotFile
                                ],
                                CopyDependabotFile);

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
            /(# Changelog[\s\S]*?[\n$])##[\s\S]*$/g,
            [
                "$1## <%- Name %> [Unreleased]",
                "  - Initial release",
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
 * Copies the dependabot configuration to the proper package.
 *
 * @returns
 * The task.
 */
export function CopyDependabotFile(): NodeJS.ReadWriteStream
{
    return src(dependabotFile).pipe(dest(CommonTemplatePath(customProjectGeneratorName, relative(__dirname, dirname(dependabotFile)))));
}

CopyDependabotFile.description = "Copies the dependabot configuration to the proper mono-repo package.";

/**
 * Copies the workflows to the proper package.
 *
 * @returns
 * The task.
 */
export function CopyWorkflows(): NodeJS.ReadWriteStream
{
    return src(join(workflowsDir, "**")).pipe(dest(CommonTemplatePath(customProjectGeneratorName, relative(__dirname, workflowsDir))));
}

CopyWorkflows.description = "Copies the workflows to the proper package.";
