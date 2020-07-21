import { TestContext } from "@manuth/extended-yo-generator-test";
import { TSGeneratorGenerator } from "../../../../generators/generator/TSGeneratorGenerator";
import { TSGeneratorCodeWorkspaceTests } from "./TSGeneratorCodeWorkspace.test";

/**
 * Registers tests for the `Generator`-generator.
 *
 * @param context
 * The test-context.
 */
export function ComponentTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        "Components",
        () =>
        {
            TSGeneratorCodeWorkspaceTests(context);
        });
}
