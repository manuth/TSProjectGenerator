import { basename } from "path";
import { AppGenerator } from "../../../generators/app/AppGenerator";
import { TestContext } from "../../TestContext";
import { AppGeneratorTests } from "./AppGenerator.test";

/**
 * Registers tests for the generators.
 *
 * @param context
 * The test-context.
 */
export function AppTests(context: TestContext<AppGenerator>): void
{
    suite(
        basename(__dirname),
        () =>
        {
            AppGeneratorTests(context);
        });
}
