import { TestContext } from "@manuth/extended-yo-generator-test";
import { TSProjectGenerator } from "../../Project/TSProjectGenerator";
import { ComponentTests } from "./Components";
import { FileMappingTests } from "./FileMappings";

/**
 * Registers tests for linting-components.
 *
 * @param context
 * The test-context.
 */
export function LintingTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        "Linting",
        () =>
        {
            FileMappingTests(context);
            ComponentTests(context);
        });
}
