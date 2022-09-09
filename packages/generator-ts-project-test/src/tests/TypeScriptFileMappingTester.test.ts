import { doesNotReject, doesNotThrow, ok, strictEqual } from "node:assert";
import { createRequire } from "node:module";
import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { TypeScriptCreatorMapping } from "@manuth/generator-ts-project";
import { PackageType } from "@manuth/package-json-editor";
import { TempFile } from "@manuth/temp-files";
import fs from "fs-extra";
import { SourceFile } from "ts-morph";
import { ICompilationResult } from "../TypeScript/ICompilationResult.js";
import { TypeScriptFileMappingTester } from "../TypeScriptFileMappingTester.js";

const { pathExists } = fs;

/**
 * Registers tests for the {@link TypeScriptFileMappingTester `TypeScriptFileMappingTester<TGenerator, TSettings, TOptions, TFileMapping>`} class for testing.
 */
export function TypeScriptFileMappingTesterTests(): void
{
    suite(
        nameof(TypeScriptFileMappingTester),
        () =>
        {
            let context = TestContext.Default;
            let generator: TestGenerator;
            let testValue: string;
            let outputFile: TempFile;
            let fileMapping: TestTypeScriptCreatorMapping;
            let tester: TestTypeScriptFileMappingTester;

            /**
             * Provides an implementation of the {@link TypeScriptCreatorMapping `TypeScriptCreatorMapping<TSettings, TOptions>`} class for testing.
             */
            class TestTypeScriptCreatorMapping extends TypeScriptCreatorMapping<IGeneratorSettings, GeneratorOptions>
            {
                /**
                 * @inheritdoc
                 */
                public get Destination(): string
                {
                    return outputFile.FullName;
                }

                /**
                 * @inheritdoc
                 *
                 * @param sourceFile
                 * The source-file to process.
                 *
                 * @returns
                 * The processed data.
                 */
                public override async Transform(sourceFile: SourceFile): Promise<SourceFile>
                {
                    return transformer(await super.Transform(sourceFile));
                }
            }

            /**
             * Provides an implementation of the {@link TypeScriptFileMappingTester `TypeScriptFileMappingTester<TGenerator, TSettings, TOptions, TFileMapping>`} class for testing.
             */
            class TestTypeScriptFileMappingTester extends TypeScriptFileMappingTester<IGenerator<IGeneratorSettings, GeneratorOptions>, IGeneratorSettings, GeneratorOptions, TestTypeScriptCreatorMapping>
            {
                /**
                 * @inheritdoc
                 */
                public override get NodeRequire(): NodeRequire
                {
                    return super.NodeRequire;
                }

                /**
                 * @inheritdoc
                 *
                 * @param esModule
                 * A value indicating whether the underlying file should be compiled as an ESModule.
                 *
                 * @returns
                 * An object containing information about the compilation.
                 */
                public override async Compile(esModule: boolean): Promise<ICompilationResult>
                {
                    let result = await super.Compile(esModule);
                    outDir = result.TempDirectory.FullName;
                    return result;
                }
            }

            let outDir: string;
            let transformer: TestTypeScriptCreatorMapping["Transform"];

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    generator = await context.Generator;
                });

            setup(
                async () =>
                {
                    testValue = context.RandomString;

                    outputFile = new TempFile(
                        {
                            Suffix: ".ts"
                        });

                    transformer = async (sourceFile) =>
                    {
                        sourceFile.addExportAssignment(
                            {
                                expression: JSON.stringify(testValue),
                                isExportEquals: false
                            });

                        return sourceFile;
                    };

                    fileMapping = new TestTypeScriptCreatorMapping(generator);
                    tester = new TestTypeScriptFileMappingTester(generator, fileMapping);
                    await tester.Run();
                });

            teardown(
                () =>
                {
                    outputFile.Dispose();
                });

            /**
             * Registers a test for checking whether the files compiled by the {@link TypeScriptFileMappingTester `TypeScriptFileMappingTester<TGenerator, TSettings, TOptions, TFileMapping>`} have been deleted.
             *
             * @param action
             * The action which has been executed.
             */
            function RegisterCleanupTest(action: string): void
            {
                test(
                    `Checking whether the compilation output is deleted after ${action} the file…`,
                    async function()
                    {
                        this.timeout(30 * 1000);
                        this.slow(15 * 1000);
                        await tester.Require();
                        ok(!await pathExists(outDir));
                    });
            }

            suite(
                nameof<TestTypeScriptFileMappingTester>((tester) => tester.Compile),
                () =>
                {
                    test(
                        `Checking whether files can be converted to both \`${nameof(PackageType.ESModule)}\` and \`${nameof(PackageType.CommonJS)}\`…`,
                        async () =>
                        {
                            let result = await tester.Compile(true);
                            await doesNotReject(() => import(result.FileName));
                            result.TempDirectory.Dispose();
                            result = await tester.Compile(false);
                            doesNotThrow(() => createRequire(import.meta.url)(result.FileName));
                            result.TempDirectory.Dispose();
                        });
                });

            suite(
                nameof<TestTypeScriptFileMappingTester>((tester) => tester.Require),
                () =>
                {
                    setup(
                        async () =>
                        {
                            transformer = async (sourceFile) =>
                            {
                                sourceFile.addExportAssignment(
                                    {
                                        expression: JSON.stringify(testValue)
                                    });

                                return sourceFile;
                            };

                            await tester.Run();
                        });

                    test(
                        "Checking whether typescript-files can be required…",
                        async function()
                        {
                            this.timeout(30 * 1000);
                            this.slow(15 * 1000);
                            strictEqual(await tester.Require(), testValue);
                        });

                    test(
                        `Checking whether the \`${nameof(require)}\` cache is cleaned after requiring the file…`,
                        async function()
                        {
                            this.timeout(30 * 1000);
                            this.slow(15 * 1000);
                            await tester.Require();
                            strictEqual(Object.keys(tester.NodeRequire.cache).length, 0);
                        });

                    RegisterCleanupTest("requiring");
                });

            suite(
                nameof<TestTypeScriptFileMappingTester>((tester) => tester.Import),
                () =>
                {
                    test(
                        "Checking whether files can be imported…",
                        async function()
                        {
                            this.timeout(30 * 1000);
                            this.slow(15 * 1000);
                            strictEqual((await tester.Import()).default, testValue);
                        });

                    RegisterCleanupTest("importing");
                });

            suite(
                nameof<TestTypeScriptFileMappingTester>((tester) => tester.ImportDefault),
                () =>
                {
                    test(
                        "Checking whether the default export of files can be determined…",
                        async function()
                        {
                            this.timeout(30 * 1000);
                            this.slow(15 * 1000);
                            strictEqual(await tester.ImportDefault(), testValue);
                        });

                    RegisterCleanupTest("default importing");
                });
        });
}
