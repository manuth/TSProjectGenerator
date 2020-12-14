import { ITestGeneratorOptions, ITestOptions, TestGenerator } from "@manuth/extended-yo-generator-test";
import { TestContext } from "../TestContext";
import { ComponentTests } from "./Components";
import { ExtensionsProcessorTests } from "./ExtensionsProcessor.test";
import { FileMappingTests } from "./FileMappings";
import { LaunchSettingsProcessorTests } from "./LaunchSettingsProcessor.test";
import { SettingsProcessorTest } from "./SettingsProcessor.test";
import { TasksProcessorTests } from "./TasksProcessor.test";
import { VSCodeJSONProcessorTests } from "./VSCodeJSONProcessor.test";
import { WorkspaceProcessorTests } from "./WorkspaceProcessor.test";

/**
 * Registers tests for `VSCode` components.
 *
 * @param context
 * The test-context.
 */
export function VSCodeTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "VSCode",
        () =>
        {
            VSCodeJSONProcessorTests(context);
            ExtensionsProcessorTests(context);
            LaunchSettingsProcessorTests(context);
            SettingsProcessorTest(context);
            TasksProcessorTests(context);
            WorkspaceProcessorTests(context);
            FileMappingTests(context);
            ComponentTests(context);
        });
}
