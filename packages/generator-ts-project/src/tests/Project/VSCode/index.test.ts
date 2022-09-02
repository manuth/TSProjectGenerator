import { basename } from "path";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator.js";
import { TestContext } from "../../TestContext.js";
import { TSProjectExtensionsProcessorTests } from "./TSProjectExtensionsProcessor.test.js";
import { TSProjectLaunchSettingsProcessorTests } from "./TSProjectLaunchSettingsProcessor.test.js";
import { TSProjectSettingsProcessorTests } from "./TSProjectSettingsProcessor.test.js";
import { TSProjectTasksProcessorTests } from "./TSProjectTasksProcessor.test.js";

/**
 * Registers tests for `VSCode` components for {@link TSProjectGenerator `TSProjectGenerator<TSettings, TOptions>`}s.
 *
 * @param context
 * The test-context.
 */
export function VSCodeTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            TSProjectExtensionsProcessorTests(context);
            TSProjectLaunchSettingsProcessorTests(context);
            TSProjectSettingsProcessorTests(context);
            TSProjectTasksProcessorTests(context);
        });
}
