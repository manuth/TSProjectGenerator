import { strictEqual } from "node:assert";
import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { TypeScriptCreatorMapping } from "@manuth/generator-ts-project";
import { TempFile } from "@manuth/temp-files";
import { SourceFile } from "ts-morph";
import { TypeScriptFileMappingTester } from "../TypeScriptFileMappingTester.js";

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
            }

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

                    transformer = async (sourceFile) => sourceFile;
                    fileMapping = new TestTypeScriptCreatorMapping(generator);
                    tester = new TestTypeScriptFileMappingTester(generator, fileMapping);
                });

            teardown(
                () =>
                {
                    outputFile.Dispose();
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
                });
        });
}
