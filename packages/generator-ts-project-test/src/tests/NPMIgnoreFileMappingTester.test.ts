import { doesNotReject, ok, rejects, strictEqual } from "assert";
import { basename } from "path";
import { GeneratorOptions, IFileMapping, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { NPMIgnoreFileMapping } from "@manuth/generator-ts-project";
import { TempDirectory, TempFile } from "@manuth/temp-files";
import dedent = require("dedent");
import { ensureFile, pathExists, readFile, writeFile } from "fs-extra";
import { normalize } from "upath";
import { NPMIgnoreFileMappingTester } from "../NPMIgnoreFileMappingTester";

/**
 * Registers tests for the {@link NPMIgnoreFileMappingTester `NPMIgnoreFileMappingTester<TGenerator, TSettings, TOptions, TFileMapping>`} class.
 */
export function NPMIgnoreFileMappingTesterTests(): void
{
    suite(
        nameof(NPMIgnoreFileMappingTester),
        () =>
        {
            let context = TestContext.Default;
            let generator: TestGenerator;
            let includedFile: TempFile;
            let excludedFile: TempFile;
            let includedDir: TempDirectory;
            let excludedDir: TempDirectory;
            let includedDirFileName: string;
            let excludedDirFileName: string;
            let tester: NPMIgnoreFileMappingTester<IGenerator<IGeneratorSettings, GeneratorOptions>, IGeneratorSettings, GeneratorOptions, IFileMapping<IGeneratorSettings, GeneratorOptions>>;

            /**
             * Asserts the behavior of the tester.
             *
             * @param path
             * The path to test.
             *
             * @param file
             * A value indicating whether the specified {@link path `path`} points to a file.
             *
             * @param ignored
             * A value indicating whether the file-system entry located at the specified {@link path `path`} is expected to be ignored.
             *
             * @param throws
             * A value indicating whether the assertion is expected to throw an error.
             */
            async function AssertBehavior(path: string, file: boolean, ignored = true, throws = false): Promise<void>
            {
                let assertMethod = file ? tester.AssertIgnored : tester.AssertDirectoryIgnored;
                assertMethod = assertMethod.bind(tester);

                let assertionRunners: Array<() => Promise<unknown>> = [
                    () => assertMethod(path, ignored)
                ];

                if (ignored)
                {
                    assertionRunners = [
                        () => assertMethod(path),
                        ...assertionRunners
                    ];
                }

                for (let assertionRunner of assertionRunners)
                {
                    if (throws)
                    {
                        await rejects(
                            assertionRunner,
                            (thrown) =>
                            {
                                return new RegExp(`${file ? "file" : "directory"}.*unexpectedly.*${ignored ? "not" : ""}.*ignored!`).test(`${thrown}`) &&
                                    ignored ?
                                    true :
                                    !`${thrown}`.includes("not");
                            });
                    }
                    else
                    {
                        await doesNotReject(assertionRunner);
                    }
                }
            }

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    generator = await context.Generator;
                });

            setup(
                async () =>
                {
                    includedFile = new TempFile(
                        {
                            Directory: generator.destinationPath()
                        });

                    excludedFile = new TempFile(
                        {
                            Directory: generator.destinationPath()
                        });

                    includedDir = new TempDirectory(
                        {
                            Directory: generator.destinationPath()
                        });

                    excludedDir = new TempDirectory(
                        {
                            Directory: generator.destinationPath()
                        });

                    tester = new NPMIgnoreFileMappingTester(
                        generator,
                        {
                            Destination: NPMIgnoreFileMapping.FileName
                        });

                    includedDirFileName = includedDir.MakePath(".tmp");
                    excludedDirFileName = excludedDir.MakePath(".tmp");
                    await ensureFile(includedDirFileName);
                    await ensureFile(excludedDirFileName);

                    await tester.WriteOutput(
                        dedent(
                            `
                                ${basename(excludedFile.FullName)}
                                ${basename(excludedDir.FullName)}`));
                });

            teardown(
                () =>
                {
                    for (let fileSystemEntry of [includedFile, excludedFile, includedDir, excludedDir])
                    {
                        if (!fileSystemEntry.Disposed)
                        {
                            fileSystemEntry.Dispose();
                        }
                    }
                });

            suite(
                nameof<NPMIgnoreFileMappingTester<any, any, any, any>>((tester) => tester.GetFileList),
                () =>
                {
                    test(
                        "Checking whether the included files are determined correctly…",
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);
                            ok((await tester.GetFileList()).includes(normalize(includedFile.FullName)));
                            ok(!(await tester.GetFileList()).includes(normalize(excludedFile.FullName)));
                            ok((await tester.GetFileList()).includes(normalize(includedDirFileName)));
                            ok(!(await tester.GetFileList()).includes(normalize(excludedDirFileName)));
                        });
                });

            suite(
                nameof<NPMIgnoreFileMappingTester<any, any, any, any>>((tester) => tester.AssertIgnored),
                () =>
                {
                    test(
                        "Checking whether the inclusion of files can be asserted correctly…",
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);
                            await AssertBehavior(excludedFile.FullName, true);
                            await AssertBehavior(includedFile.FullName, true, true, true);
                            await AssertBehavior(includedFile.FullName, true, false, false);
                            await AssertBehavior(excludedFile.FullName, true, false, true);
                        });

                    test(
                        "Checking whether the inclusion of files in sub-directories can be asserted correctly…",
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);
                            await AssertBehavior(excludedDirFileName, true);
                            await AssertBehavior(includedDirFileName, true, true, true);
                            await AssertBehavior(includedDirFileName, true, false, false);
                            await AssertBehavior(excludedDirFileName, true, false, true);
                        });

                    test(
                        "Checking whether the inclusion of inexistent files can be asserted correctly…",
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);
                            excludedFile.Dispose();
                            ok(!await pathExists(excludedFile.FullName));
                            await AssertBehavior(excludedFile.FullName, true);
                            ok(!await pathExists(excludedFile.FullName));
                        });

                    test(
                        "Checking whether the inclusion of existent files can be asserted correctly…",
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);
                            let content = context.RandomString;
                            await writeFile(includedFile.FullName, content);
                            await writeFile(excludedFile.FullName, content);
                            await AssertBehavior(includedFile.FullName, true, false);
                            await AssertBehavior(excludedFile.FullName, true, true);
                            strictEqual((await readFile(includedFile.FullName)).toString(), content);
                            strictEqual((await readFile(excludedFile.FullName)).toString(), content);
                        });
                });

            suite(
                nameof<NPMIgnoreFileMappingTester<any, any, any, any>>((tester) => tester.AssertDirectoryIgnored),
                () =>
                {
                    test(
                        "Checking whether the inclusion of directories can be asserted correctly…",
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);
                            await AssertBehavior(excludedDir.FullName, false);
                            await AssertBehavior(includedDir.FullName, false, true, true);
                            await AssertBehavior(includedDir.FullName, false, false, false);
                            await AssertBehavior(excludedDir.FullName, false, false, true);
                        });
                });
        });
}
