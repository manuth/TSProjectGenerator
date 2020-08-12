import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";
import { TestContext } from "../../TestContext";
import { LintingComponentTests } from "./LintingComponent.test";

/**
 * Registers tests for linting-components.
 *
 * @param context
 * The test-context.
 */
export function ComponentTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        "Components",
        () =>
        {
            LintingComponentTests(context);
        });
}
