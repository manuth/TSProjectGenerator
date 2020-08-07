import { TestContext } from "@manuth/extended-yo-generator-test";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";
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
