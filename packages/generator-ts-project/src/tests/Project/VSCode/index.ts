import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";
import { TestContext } from "../../TestContext";
import { TSProjectExtensionsProcessorTests } from "./TSProjectExtensionsProcessor.test";
import { TSProjectLaunchSettingsProcessorTests } from "./TSProjectLaunchSettingsProcessor.test";
import { TSProjectSettingsProcessorTests } from "./TSProjectSettingsProcessor.test";
import { TSProjectTasksProcessorTests } from "./TSProjectTasksProcessor.test";

/**
 * Registers tests for `VSCode` components for `TSProject`s.
 *
 * @param context
 * The test-context.
 */
export function VSCodeTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        "VSCode",
        () =>
        {
            TSProjectExtensionsProcessorTests(context);
            TSProjectLaunchSettingsProcessorTests(context);
            TSProjectSettingsProcessorTests(context);
            TSProjectTasksProcessorTests(context);
        });
}
