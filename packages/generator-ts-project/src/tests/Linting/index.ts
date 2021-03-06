import { TSProjectGenerator } from "../../Project/TSProjectGenerator";
import { TestContext } from "../TestContext";
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
