import { basename } from "path";
import { TSGeneratorGenerator } from "../../../../generators/generator/TSGeneratorGenerator.js";
import { TestContext } from "../../../TestContext.js";
import { TSGeneratorLaunchSettingsProcessorTests } from "./TSGeneratorLaunchSettingsProcessor.test.js";

/**
 * Registers tests for VSCode-components for {@link TSGeneratorGenerator `TSGeneratorGenerator<TSettings, TOptions>`}s.
 *
 * @param context
 * The test-context.
 */
export function VSCodeTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            TSGeneratorLaunchSettingsProcessorTests(context);
        });
}
