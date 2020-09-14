import Assert = require("assert");
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { FileMappingTester, ITestGeneratorOptions, ITestGeneratorSettings, ITestOptions, TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { TempFile } from "@manuth/temp-files";
import dedent = require("dedent");
import { writeFile } from "fs-extra";
import { MarkdownFileProcessor } from "../MarkdownFileProcessor";

/**
 * Registers tests for the `MarkdownFileProcessor` class.
 *
 * @param context
 * The test-context.
 */
export function MarkdownFileProcessorTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "MarkdownFileProcessor",
        () =>
        {
            let sourceFile: TempFile;
            let destinationFile: TempFile;
            let fileMappingOptions: MarkdownFileProcessor<ITestGeneratorSettings, GeneratorOptions>;
            let tester: FileMappingTester<TestGenerator, ITestGeneratorSettings, GeneratorOptions, MarkdownFileProcessor<ITestGeneratorSettings, GeneratorOptions>>;
            let source: string;
            let expected: string;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
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

            test(
                "Checking whether unnecessary new-lines are stripped correctly…",
                async () =>
                {
                    await tester.Run();
                    Assert.strictEqual(await tester.Content, expected);
                });
        });
}
