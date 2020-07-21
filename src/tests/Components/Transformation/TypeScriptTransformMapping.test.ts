import Assert = require("assert");
import { FileMapping } from "@manuth/extended-yo-generator";
import { TestContext, TestGenerator, ITestGeneratorOptions, ITestOptions } from "@manuth/extended-yo-generator-test";
import dedent = require("dedent");
import { split } from "eol";
import { TransformerFactory, SourceFile, Visitor, visitNode, NodeFlags, visitEachChild, isVariableDeclarationList } from "typescript";
import { TestTypeScriptTransformMapping } from "./TestTypeScriptTransformMapping";

/**
 * Registers tests for the `TypeScriptTransformMapping` class.
 *
 * @param context
 * The test-context.
 */
export function TypeScriptTransformMappingTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "TypeScriptTransformMapping",
        () =>
        {
            /**
             * Asserts the result of a file-transformation.
             *
             * @param content
             * The original content.
             *
             * @param transformers
             * The transformers to apply.
             *
             * @param expected
             * The expected result.
             */
            async function AssertTransformation(content: string, transformers: Array<TransformerFactory<SourceFile>>, expected: string): Promise<void>
            {
                let fileMappingOptions = new TestTypeScriptTransformMapping(content, transformers);
                let fileMapping = new FileMapping(await context.Generator, fileMappingOptions);
                await fileMapping.Processor(fileMapping, await context.Generator);
                Assert.deepStrictEqual(split(fileMappingOptions.Result), split(expected));
            }

            test(
                "Checking whether transformations are applied correctly…",
                async () =>
                {
                    await AssertTransformation(
                        dedent(
                            `
                                let x = 1;

                                let y = 2;

                                let z = 3;`),
                        [
                            (context) =>
                            {
                                let visitor: Visitor;

                                visitor = (node) =>
                                {
                                    if (isVariableDeclarationList(node))
                                    {
                                        node.flags = NodeFlags.Const;
                                        return node;
                                    }
                                    else
                                    {
                                        return visitEachChild(node, visitor, context);
                                    }
                                };

                                return (node) =>
                                {
                                    return visitNode(node, visitor);
                                };
                            }
                        ],
                        dedent(
                            `
                                const x = 1;

                                const y = 2;

                                const z = 3;`) + "\n");
                });
        });
}
