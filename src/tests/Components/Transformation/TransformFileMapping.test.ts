import Assert = require("assert");
import { FileMapping } from "@manuth/extended-yo-generator";
import { TestContext, TestGenerator, ITestGeneratorOptions, ITestOptions } from "@manuth/extended-yo-generator-test";
import dedent = require("dedent");
import { TestTransformFileMapping } from "./TestTransformFileMapping";

/**
 * Registers tests for the `TransformFileMapping` class.
 *
 * @param context
 * The test-context.
 */
export function TransformFileMappingTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "TransformFileMapping",
        () =>
        {
            /**
             * Asserts the result of a file-transformation.
             *
             * @param originalContent
             * The original content.
             *
             * @param emptyTransformationContent
             * The original content without any transformation being applied.
             *
             * @param transformedContent
             * The transformed version of the original content.
             *
             * @param expected
             * The expected result.
             */
            async function AssertTransformation(originalContent: string, emptyTransformationContent: string, transformedContent: string, expected: string): Promise<void>
            {
                let fileMappingOptions = new TestTransformFileMapping(originalContent, emptyTransformationContent, transformedContent);
                let fileMapping = new FileMapping(await context.Generator, fileMappingOptions);
                await fileMapping.Processor(fileMapping, await context.Generator);
                Assert.strictEqual(fileMappingOptions.Result, expected);
            }

            test(
                "Checking whether newline characters are preserved…",
                async function()
                {
                    this.slow(1 * 1000);

                    await AssertTransformation(
                        dedent(
                            `
                                console.log("a");


                                console.log("b");`),
                        dedent(
                            `
                                console.log("a");
                                console.log("b");`),
                        dedent(
                            `
                                console.log("a");
                                console.log("c");`),
                        dedent(
                            `
                                console.log("a");


                                console.log("c");`));
                });

            test(
                "Checking whether newline characters are preserved on line-replacements…",
                async () =>
                {
                    await AssertTransformation(
                        dedent(
                            `
                                console.log("a");
                                console.log("b");


                                console.log("c");`),
                        dedent(
                            `
                            console.log("a");
                            console.log("b");
                            console.log("c");`),
                        dedent(
                            `
                            console.log("a");
                            console.log("x");
                            console.log("d");`),
                        dedent(
                            `
                            console.log("a");
                            console.log("x");


                            console.log("d");`));
                });
        });
}
