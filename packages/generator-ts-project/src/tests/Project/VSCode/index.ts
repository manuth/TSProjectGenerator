import { TestContext } from "@manuth/extended-yo-generator-test";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";
import { TSProjectExtensionsProcessorTests } from "./TSProjectExtensionsProcessor.test";
import { TSProjectLaunchFileProcessorTests } from "./TSProjectLaunchFileProcessor.test";
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
            TSProjectLaunchFileProcessorTests(context);
            TSProjectSettingsProcessorTests(context);
            TSProjectTasksProcessorTests(context);
        });
}
