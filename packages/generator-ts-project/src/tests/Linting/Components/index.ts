import { basename } from "path";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator.js";
import { TestContext } from "../../TestContext.js";
import { LintingComponentTests } from "./LintingComponent.test.js";

/**
 * Registers tests for linting-components.
 *
 * @param context
 * The test-context.
 */
export function ComponentTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            LintingComponentTests(context);
        });
}
