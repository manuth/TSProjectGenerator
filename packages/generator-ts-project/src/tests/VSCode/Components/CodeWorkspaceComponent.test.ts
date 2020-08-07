import Assert = require("assert");
import { TestContext, TestGenerator, ITestGeneratorSettings } from "@manuth/extended-yo-generator-test";
import { Random } from "random-js";
import { TestJSONProcessor } from "../../Components/TestJSONProcessor";
import { TestCodeWorkspaceComponent } from "./TestCodeWorkspaceComponent";

/**
 * Registers tests for the `CodeWorkspaceComponent` class.
 *
 * @param context
 * The test-context.
 */
export function CodeWorkspaceComponentTests(context: TestContext<TestGenerator>): void
{
    suite(
        "CodeWorkspaceComponent",
        () =>
        {
            let random: Random;
            let component: TestCodeWorkspaceComponent<ITestGeneratorSettings>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    random = new Random();
                    component = new TestCodeWorkspaceComponent(await context.Generator);
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
                    let extensions = RandomData();
                    let debugSettings = RandomData();
                    let settings = RandomData();
                    let tasks = RandomData();
                    let extensionsProcessor = new TestJSONProcessor<ITestGeneratorSettings>(extensions);
                    let debugSettingsProcessor = new TestJSONProcessor<ITestGeneratorSettings>(debugSettings);
                    let settingsProcessor = new TestJSONProcessor<ITestGeneratorSettings>(settings);
                    let tasksProcessor = new TestJSONProcessor<ITestGeneratorSettings>(tasks);
                    component.ExtensionsProcessor = extensionsProcessor;
                    component.LaunchFileProcessor = debugSettingsProcessor;
                    component.SettingsProcessor = settingsProcessor;
                    component.TasksProcessor = tasksProcessor;
                    Assert.strictEqual(await component.ExtensionsMetadata, extensions);
                    Assert.strictEqual(await component.LaunchMetadata, debugSettings);
                    Assert.strictEqual(await component.SettingsMetadata, settings);
                    Assert.strictEqual(await component.TasksMetadata, tasks);
                });
        });
}
