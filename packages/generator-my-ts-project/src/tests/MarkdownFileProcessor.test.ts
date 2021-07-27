import { strictEqual } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { FileMappingTester, ITestGeneratorSettings, TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { TempFile } from "@manuth/temp-files";
import dedent = require("dedent");
import { writeFile } from "fs-extra";
import { MarkdownFileProcessor } from "../MarkdownFileProcessor";

/**
 * Registers tests for the {@link MarkdownFileProcessor `MarkdownFileProcessor<TSettings, TOptions>`} class.
 */
export function MarkdownFileProcessorTests(): void
{
    suite(
        nameof(MarkdownFileProcessor),
        () =>
        {
            let context = TestContext.Default;
            let sourceFile: TempFile;
            let destinationFile: TempFile;
            let fileMappingOptions: MarkdownFileProcessor<ITestGeneratorSettings, GeneratorOptions>;
            let tester: FileMappingTester<TestGenerator, ITestGeneratorSettings, GeneratorOptions, MarkdownFileProcessor<ITestGeneratorSettings, GeneratorOptions>>;
            let source: string;
            let expected: string;

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    sourceFile = new TempFile();
                    destinationFile = new TempFile();

                    source = dedent(
                        `
                            ### Hello World

                            This is a test.`);

                    expected = dedent(
                        `
                            ### Hello World
                            This is a test.`);

                    await writeFile(sourceFile.FullName, source);

                    fileMappingOptions = new MarkdownFileProcessor(
                        await context.Generator,
                        {
                            Source: sourceFile.FullName,
                            Destination: destinationFile.FullName
                        });

                    tester = new FileMappingTester(await context.Generator, fileMappingOptions);
                });

            suite(
                nameof<MarkdownFileProcessor<any, any>>((processor) => processor.Processor),
                () =>
                {
                    test(
                        "Checking whether unnecessary new-lines are stripped correctly…",
                        async function()
                        {
                            this.timeout(1 * 1000);
                            this.slow(0.5 * 1000);
                            await tester.Run();
                            strictEqual(await tester.ReadOutput(), expected);
                        });
                });
        });
}
