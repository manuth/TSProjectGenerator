import glob = require("glob");
import { dest, parallel, series, src, watch } from "gulp";
import rename = require("gulp-rename");
import merge = require("merge-stream");
import minimist = require("minimist");
import { basename, join } from "upath";
import ApplyPatch = require("./gulp/ApplyPatch");

let projectGeneratorName = "generator-ts-project";
let customProjectGeneratorName = "generator-my-ts-project";
let gitIgnoreFile = ".gitignore";
let npmIgnoreFile = ".npmignore";
let droneFile = ".drone.yml";
let licenseFile = "LICENSE";
let gitDiffFile = GulpPath("gitignore.diff");
let npmDiffFile = CommonTemplatePath(projectGeneratorName, "npmignore.diff");
let customNPMDiffFile = GulpPath("npmignore.diff");
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
                    CopyLicenseFile
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
                                    licenseFile
                                ],
                                CopyLicenseFile);
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

CopyGitIgnore.description = `Copies the \`${gitIgnoreFile}\` file to the mono-repo packages.`;

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

CopyNPMIgnore.description = `Copies the \`${npmIgnoreFile}\` file to the mono-repo packages.`;

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

CopyDroneFile.description = `Copies the \`${droneFile}\` file to the mono-repo packages.`;

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
