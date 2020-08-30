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
        "App",
        () =>
        {
            AppGeneratorTests(context);
        });
}
