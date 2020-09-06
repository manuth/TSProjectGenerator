import { TSGeneratorGenerator } from "../../../../generators/generator/TSGeneratorGenerator";
import { TestContext } from "../../../TestContext";
import { TSGeneratorLaunchSettingsProcessorTests } from "./TSGeneratorLaunchSettingsProcessor.test";

/**
 * Registers tests for VSCode-components for `TSGenerator`s.
 *
 * @param context
 * The test-context.
 */
export function VSCodeTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        "VSCode",
        () =>
        {
            TSGeneratorLaunchSettingsProcessorTests(context);
        });
}
