import { strictEqual } from "assert";
import { ensureDir, ensureFile, lstat, readdir } from "fs-extra";
import packlist = require("npm-packlist");
import { resolve } from "upath";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { NPMIgnoreFileMapping } from "../../../Project/FileMappings/NPMIgnoreFileMapping";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";
import { TestContext } from "../../TestContext";

/**
 * Registers tests for the {@link NPMIgnoreFileMapping `NPMIgnoreFileMapping<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function NPMIgnoreFileMappingTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        "NPMIgnoreFileMapping",
        () =>
        {
            let includedFiles: string[];

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    includedFiles = await Promise.all((await packlist({ path: await DestinationPath() })).map((path) => DestinationPath(path)));
                });

            /**
             * Resolves a path relative to the generated directory.
             *
             * @param path
             * The path to resolve.
             *
             * @returns
             * The resolved path.
             */
            async function DestinationPath(...path: string[]): Promise<string>
            {
                return resolve((await context.Generator).destinationPath(...path));
            }

            /**
             * Asserts whether the file at the specified {@link path `path`} is {@link ignored `ignored`}.
             *
             * @param path
             * The path to check.
             *
             * @param ignored
             * A value indicating whether the {@link path `path`} is expected to be ignored.
             */
            async function AssertIgnored(path: string, ignored = true): Promise<void>
            {
                strictEqual(includedFiles.includes(await DestinationPath(path)), !ignored);
            }

            /**
             * Asserts whether the directory at the specified {@link path `path`} is {@link ignored `ignored`}.
             *
             * @param path
             * The path to check.
             *
             * @param ignored
             * A value indicating whether the {@link path `path`} is expected to be ignored.
             */
            async function AssertDirectoryIgnored(path: string, ignored = true): Promise<void>
            {
                let fileEntries = await readdir(await DestinationPath(path));

                for (let fileEntry of fileEntries)
                {
                    fileEntry = await DestinationPath(path, fileEntry);

                    if ((await lstat(fileEntry)).isDirectory())
                    {
                        await AssertDirectoryIgnored(fileEntry, ignored);
                    }
                    else
                    {
                        await AssertIgnored(fileEntry, ignored);
                    }
                }
            }

            test(
                "Checking whether ignore-files are ignored…",
                async () =>
                {
                    await AssertIgnored(".npmignore");
                });

            test(
                "Checking whether TypeScript-configurations are ignored…",
                async () =>
                {
                    await AssertIgnored("tsconfig.json");
                });

            test(
                "Checking whether eslint-files are ignored…",
                async () =>
                {
                    await AssertIgnored(".eslintrc.js");
                });

            test(
                "Checking whether mocha-files are ignored…",
                async () =>
                {
                    await AssertIgnored(".mocharc.json");
                });

            test(
                "Checking whether vscode-files are ignored…",
                async () =>
                {
                    await AssertDirectoryIgnored(".vscode");
                });

            test(
                "Checking whether github-files are ignored…",
                async () =>
                {
                    let testFile = context.RandomString;
                    let dirName = ".github";
                    await ensureDir(await DestinationPath(dirName));
                    await ensureFile(await DestinationPath(dirName, testFile));
                    await AssertDirectoryIgnored(".github");
                });
        });
}
