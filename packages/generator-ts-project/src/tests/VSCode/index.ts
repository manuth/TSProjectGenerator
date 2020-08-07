import { TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { ComponentTests } from "./Components";
import { ExtensionsProcessorTests } from "./ExtensionsProcessor.test";
import { FileMappingTests } from "./FileMappings";
import { LaunchFileProcessorTests } from "./LaunchFileProcessor.test";
import { SettingsProcessorTest } from "./SettingsProcessor.test";
import { TasksProcessorTests } from "./TasksProcessor.test";

/**
 * Registers tests for `VSCode` components.
 *
 * @param context
 * The test-context.
 */
export function VSCodeTests(context: TestContext<TestGenerator>): void
{
    suite(
        "VSCode",
        () =>
        {
            ExtensionsProcessorTests(context);
            LaunchFileProcessorTests(context);
            SettingsProcessorTest(context);
            TasksProcessorTests(context);
            FileMappingTests(context);
            ComponentTests(context);
        });
}
