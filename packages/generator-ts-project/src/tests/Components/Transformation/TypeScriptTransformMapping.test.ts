import Assert = require("assert");
import { TestGenerator, ITestGeneratorOptions, ITestOptions } from "@manuth/extended-yo-generator-test";
import dedent = require("dedent");
import { split } from "eol";
import { TransformerFactory, SourceFile, Visitor, visitNode, NodeFlags, visitEachChild, isVariableDeclarationList } from "typescript";
import { TestContext } from "../../TestContext";
import { FileMappingTester } from "../FileMappingTester";
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
                let fileMappingOptions = new TestTypeScriptTransformMapping(await context.Generator, content, transformers);
                let tester = new FileMappingTester(await context.Generator, fileMappingOptions);
                await tester.Run();
                Assert.deepStrictEqual(split(await tester.Content), split(expected));
            }

            test(
                "Checking whether transformations are applied correctly…",
                async function()
                {
                    this.slow(0.5 * 1000);

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
