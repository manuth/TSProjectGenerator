import { TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { ComponentTests } from "./Components";
import { FileMappingTests } from "./FileMappings";

/**
 * Registers tests for `VSCode` components.
 *
 * @param context
 * The test-context.
 */
export function VSCodeTests(context: TestContext<TestGenerator>): void
{
    suite(
        "VSCode",
        () =>
        {
            FileMappingTests(context);
            ComponentTests(context);
        });
}
