import { strictEqual } from "node:assert";
import { GeneratorOptions, IFileMapping, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { TypeScriptFileMappingTester } from "@manuth/generator-ts-project-test";
import { TempFile } from "@manuth/temp-files";
import { createSandbox, SinonSandbox } from "sinon";
import { SourceFile } from "ts-morph";
import { ModuleIndexFileMapping } from "../../../../Project/FileMappings/TypeScript/ModuleIndexFileMapping.js";
import { ITSProjectSettings } from "../../../../Project/Settings/ITSProjectSettings.js";
import { TSProjectSettingKey } from "../../../../Project/Settings/TSProjectSettingKey.js";
import { TSProjectGenerator } from "../../../../Project/TSProjectGenerator.js";
import { TestContext } from "../../../TestContext.js";

/**
 * Registers tests for the {@link ModuleIndexFileMapping `ModuleIndexFileMapping<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function ModuleIndexFileMappingTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        nameof(ModuleIndexFileMapping),
        () =>
        {
            let generator: TSProjectGenerator;
            let sandbox: SinonSandbox;
            let outputFile: TempFile;
            let fileMapping: TestModuleIndexFileMapping;
            let tester: TypeScriptFileMappingTester<IGenerator<IGeneratorSettings, GeneratorOptions>, IGeneratorSettings, GeneratorOptions, IFileMapping<IGeneratorSettings, GeneratorOptions>>;

            /**
             * Registers tests for the {@link ModuleIndexFileMapping `ModuleIndexFileMapping<TSettings, TOptions>`} class.
             */
            class TestModuleIndexFileMapping extends ModuleIndexFileMapping<ITSProjectSettings, GeneratorOptions>
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
                public override Transform(sourceFile: SourceFile): Promise<SourceFile>
                {
                    this.Dispose();
                    return super.Transform(sourceFile);
                }
            }

            suiteSetup(
                async function()
                {
                    generator = await context.Generator;
                });

            setup(
                () =>
                {
                    sandbox = createSandbox();

                    outputFile = new TempFile(
                        {
                            Suffix: ".ts"
                        });

                    fileMapping = new TestModuleIndexFileMapping(generator);
                    tester = new TypeScriptFileMappingTester(generator, fileMapping);
                });

            teardown(
                () =>
                {
                    sandbox.restore();
                    outputFile.Dispose();
                });

            suite(
                nameof<TestModuleIndexFileMapping>((fileMapping) => fileMapping.Transform),
                () =>
                {
                    /**
                     * Transforms the file.
                     *
                     * @returns
                     * The transformed file.
                     */
                    async function TransformFile(): Promise<SourceFile>
                    {
                        return fileMapping.Transform(await fileMapping.GetSourceObject());
                    }

                    /**
                     * Asserts the correctness of the specified {@link exportedFunction `exportedFunction`}.
                     *
                     * @param exportedFunction
                     * The function to check.
                     */
                    async function AssertExportedFunction(exportedFunction: () => Promise<void>): Promise<void>
                    {
                        let messages: string[] = [];

                        sandbox.replace(
                            console,
                            "log",
                            (message) =>
                            {
                                messages.push(message);
                            });

                        await exportedFunction();
                        strictEqual(messages.length, 1);
                    }

                    test(
                        `Checking whether a function is assigned to \`${nameof.full(module.exports)}\` if the file is creates as a CommonJS module…`,
                        async function()
                        {
                            this.timeout(2 * 60 * 1000);
                            this.slow(1 * 60 * 1000);
                            generator.Settings[TSProjectSettingKey.ESModule] = false;
                            let file = await TransformFile();
                            await tester.DumpOutput(file);
                            await AssertExportedFunction(await tester.Require());
                            file.forget();
                        });

                    test(
                        "Checking whether a function is default exported if the file is created as an ESModule…",
                        async function()
                        {
                            this.timeout(2 * 60 * 1000);
                            this.slow(1 * 60 * 1000);
                            let file = await TransformFile();
                            await tester.DumpOutput(file);
                            await AssertExportedFunction(await tester.ImportDefault());
                            file.forget();
                        });
                });
        });
}
