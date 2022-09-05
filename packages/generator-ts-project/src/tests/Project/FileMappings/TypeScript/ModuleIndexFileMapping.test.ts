import { strictEqual } from "node:assert";
import { GeneratorOptions, IFileMapping, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { TypeScriptFileMappingTester } from "@manuth/generator-ts-project-test";
import { TempFile } from "@manuth/temp-files";
import { createSandbox, SinonSandbox } from "sinon";
import { SourceFile } from "ts-morph";
import { ModuleIndexFileMapping } from "../../../../Project/FileMappings/TypeScript/ModuleIndexFileMapping.js";
import { ITSProjectSettings } from "../../../../Project/Settings/ITSProjectSettings.js";
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
                    test(
                        "Checking whether the expected content is added to the file…",
                        async function()
                        {
                            this.timeout(2 * 60 * 1000);
                            this.slow(1 * 60 * 1000);
                            let file = await fileMapping.Transform(await fileMapping.GetSourceObject());
                            let messages: string[] = [];

                            sandbox.replace(
                                console,
                                "log",
                                (message) =>
                                {
                                    messages.push(message);
                                });

                            await tester.DumpOutput(file);
                            file.forget();
                            await (await tester.ImportDefault() as () => Promise<void>)();
                            strictEqual(messages.length, 1);
                        });
                });
        });
}
