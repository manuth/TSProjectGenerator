import { basename } from "path";
import { AppGenerator } from "../../../generators/app/AppGenerator.js";
import { TestContext } from "../../TestContext.js";
import { AppGeneratorTests } from "./AppGenerator.test.js";

/**
 * Registers tests for the generators.
 *
 * @param context
 * The test-context.
 */
export function AppTests(context: TestContext<AppGenerator>): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            AppGeneratorTests(context);
        });
}
