import { basename } from "path";
import { TSProjectGenerator } from "../../Project/TSProjectGenerator.js";
import { TestContext } from "../TestContext.js";
import { ComponentTests } from "./Components/index.js";
import { FileMappingTests } from "./FileMappings/index.js";

/**
 * Registers tests for linting-components.
 *
 * @param context
 * The test-context.
 */
export function LintingTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            FileMappingTests(context);
            ComponentTests(context);
        });
}
