import { strictEqual } from "assert";
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
                protected override async Transform(sourceFile: SourceFile): Promise<SourceFile>
                {
                    sourceFile = await super.Transform(sourceFile);

                    sourceFile.addExportAssignment(
                        {
                            expression: JSON.stringify(testValue)
                        });

                    return sourceFile;
                }
            }

            /**
             * Provides an implementation of the {@link TypeScriptFileMappingTester `TypeScriptFileMappingTester<TGenerator, TSettings, TOptions, TFileMapping>`} class for testing.
             */
            class TestTypeScriptFileMappingTester extends TypeScriptFileMappingTester<IGenerator<IGeneratorSettings, GeneratorOptions>, IGeneratorSettings, GeneratorOptions, TestTypeScriptCreatorMapping>
            { }

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

                    fileMapping = new TestTypeScriptCreatorMapping(generator);
                    tester = new TestTypeScriptFileMappingTester(generator, fileMapping);
                    await tester.Run();
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
                    test(
                        "Checking whether typescript-files can be required…",
                        async function()
                        {
                            this.timeout(30 * 1000);
                            this.slow(15 * 1000);
                            strictEqual(await tester.Require(), testValue);
                        });
                });
        });
}
