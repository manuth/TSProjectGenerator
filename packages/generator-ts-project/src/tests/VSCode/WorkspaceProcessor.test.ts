import Assert = require("assert");
import { TestGenerator, TestContext, ITestGeneratorSettings } from "@manuth/extended-yo-generator-test";
import { Random } from "random-js";
import { IExtensionFile } from "../../VSCode/IExtensionFile";
import { ILaunchFile } from "../../VSCode/ILaunchFile";
import { ITaskFile } from "../../VSCode/ITaskFile";
import { TestJSONProcessor } from "../Components/TestJSONProcessor";
import { TestCodeWorkspaceComponent } from "./Components/TestCodeWorkspaceComponent";
import { TestWorkspaceProcessor } from "./Components/TestWorkspaceProcessor";

/**
 * Registers tests for the `WorkspaceProcessor` class.
 *
 * @param context
 * The test-context.
 */
export function WorkspaceProcessorTests(context: TestContext<TestGenerator>): void
{
    suite(
        "WorkspaceProcessor",
        () =>
        {
            let random: Random;
            let component: TestCodeWorkspaceComponent<ITestGeneratorSettings>;
            let workspaceProcessor: TestWorkspaceProcessor<ITestGeneratorSettings>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    random = new Random();
                    component = new TestCodeWorkspaceComponent(await context.Generator);
                    workspaceProcessor = new TestWorkspaceProcessor(component);
                });

            /**
             * Generates a random object.
             *
             * @returns
             * A random object.
             */
            function RandomData(): any
            {
                return {
                    random: random.string(10)
                };
            }

            test(
                "Checking whether custom processors can be injected…",
                async () =>
                {
                    let extensions: IExtensionFile = RandomData();
                    let debugSettings: ILaunchFile = RandomData();
                    let settings: Record<string, any> = RandomData();
                    let tasks: ITaskFile = RandomData();
                    let extensionsProcessor = new TestJSONProcessor<ITestGeneratorSettings>(extensions);
                    let debugSettingsProcessor = new TestJSONProcessor<ITestGeneratorSettings>(debugSettings);
                    let settingsProcessor = new TestJSONProcessor<ITestGeneratorSettings>(settings);
                    let tasksProcessor = new TestJSONProcessor<ITestGeneratorSettings>(tasks);
                    workspaceProcessor.ExtensionsProcessor = extensionsProcessor;
                    workspaceProcessor.LaunchFileProcessor = debugSettingsProcessor;
                    workspaceProcessor.SettingsProcessor = settingsProcessor;
                    workspaceProcessor.TasksProcessor = tasksProcessor;
                    Assert.strictEqual(await component.ExtensionsMetadata, extensions);
                    Assert.strictEqual(await component.LaunchMetadata, debugSettings);
                    Assert.strictEqual(await component.SettingsMetadata, settings);
                    Assert.strictEqual(await component.TasksMetadata, tasks);
                });
        });
}
