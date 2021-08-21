import { strictEqual } from "assert";
import { GeneratorOptions, IFileMapping, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { TestGenerator } from "@manuth/extended-yo-generator-test";
import { TypeScriptFileMappingTester } from "@manuth/generator-ts-project-test";
import { TempFile } from "@manuth/temp-files";
import { createSandbox, SinonSandbox } from "sinon";
import { SourceFile } from "ts-morph";
import { ModuleIndexFileMapping } from "../../../../Project/FileMappings/TypeScript/ModuleIndexFileMapping";
import { TestContext } from "../../../TestContext";

/**
 * Registers tests for the {@link ModuleIndexFileMapping `ModuleIndexFileMapping<TSettings, TOptions>`} class.
 */
export function ModuleIndexFileMappingTests(): void
{
    suite(
        nameof(ModuleIndexFileMapping),
        () =>
        {
            let context = TestContext.Default;
            let generator: TestGenerator;
            let sandbox: SinonSandbox;
            let outputFile: TempFile;
            let fileMapping: TestModuleIndexFileMapping;
            let tester: TypeScriptFileMappingTester<IGenerator<IGeneratorSettings, GeneratorOptions>, IGeneratorSettings, GeneratorOptions, IFileMapping<IGeneratorSettings, GeneratorOptions>>;

            /**
             * Registers tests for the {@link ModuleIndexFileMapping `ModuleIndexFileMapping<TSettings, TOptions>`} class.
             */
            class TestModuleIndexFileMapping extends ModuleIndexFileMapping<IGeneratorSettings, GeneratorOptions>
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
                            await (await tester.Require() as () => Promise<void>)();
                            strictEqual(messages.length, 1);
                        });
                });
        });
}
