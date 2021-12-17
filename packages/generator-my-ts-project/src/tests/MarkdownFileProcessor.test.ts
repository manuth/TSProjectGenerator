import { strictEqual } from "assert";
import { GeneratorOptions, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { FileMappingTester, TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { TempFile } from "@manuth/temp-files";
import dedent = require("dedent");
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
            let fileMappingOptions: MarkdownFileProcessor<IGeneratorSettings, GeneratorOptions>;
            let tester: FileMappingTester<TestGenerator, IGeneratorSettings, GeneratorOptions, MarkdownFileProcessor<IGeneratorSettings, GeneratorOptions>>;
            let source: string;
            let expected: string;

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    sourceFile = new TempFile();
                    destinationFile = new TempFile();

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
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);

                            source = dedent(
                                `
                                    ### Hello World
        
                                    This is a test.`);

                            expected = dedent(
                                `
                                    ### Hello World
                                    This is a test.`);

                            await tester.WriteSource(source);
                            await tester.Run();
                            strictEqual(await tester.ReadOutput(), expected);
                        });

                    test(
                        "Checking whether lists are indented correctly…",
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);

                            source = dedent(
                                `
                                    # Test
                                    - Hello
                                      - World`);

                            expected = dedent(
                                `
                                    # Test
                                      - Hello
                                        - World`);

                            await tester.WriteSource(source);
                            await tester.Run();
                            strictEqual(await tester.ReadOutput(), expected);
                        });
                });
        });
}
