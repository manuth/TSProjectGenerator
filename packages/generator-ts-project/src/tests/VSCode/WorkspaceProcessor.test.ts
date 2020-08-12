import Assert = require("assert");
import { isNullOrUndefined } from "util";
import { TestGenerator, TestContext, ITestGeneratorSettings } from "@manuth/extended-yo-generator-test";
import { Random } from "random-js";
import { IExtensionFile } from "../../VSCode/IExtensionFile";
import { ILaunchFile } from "../../VSCode/ILaunchFile";
import { ITaskFile } from "../../VSCode/ITaskFile";
import { TestJSONProcessor } from "../Components/TestJSONProcessor";
import { TestCodeWorkspaceComponent } from "./Components/TestCodeWorkspaceComponent";
import { TestWorkspaceProcessor } from "./Components/TestWorkspaceProcessor";
import { TestCodeWorkspaceProvider } from "./FileMappings/TestCodeWorkspaceProvider";

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
            let randomExtensions: IExtensionFile;
            let randomDebugSettings: ILaunchFile;
            let randomSettings: Record<string, any>;
            let randomTasks: ITaskFile;
            let workspaceLoader: TestCodeWorkspaceProvider<ITestGeneratorSettings>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    random = new Random();
                    component = new TestCodeWorkspaceComponent(await context.Generator);
                    workspaceLoader = new TestCodeWorkspaceProvider(component);
                    component.Source = workspaceLoader;
                    workspaceProcessor = new TestWorkspaceProcessor(component);
                    component.WorkspaceProcessor = workspaceProcessor;
                });

            setup(
                async () =>
                {
                    randomExtensions = RandomData();
                    randomDebugSettings = RandomData();
                    randomSettings = RandomData();
                    randomTasks = RandomData();

                    let extensionsProcessor = new TestJSONProcessor<ITestGeneratorSettings>(randomExtensions);
                    let debugSettingsProcessor = new TestJSONProcessor<ITestGeneratorSettings>(randomDebugSettings);
                    let settingsProcessor = new TestJSONProcessor<ITestGeneratorSettings>(randomSettings);
                    let tasksProcessor = new TestJSONProcessor<ITestGeneratorSettings>(randomTasks);

                    let workspace = await workspaceLoader.WorkspaceMetadata;
                    workspace.extensions = RandomData();
                    workspace.launch = RandomData();
                    workspace.settings = RandomData();
                    workspace.tasks = RandomData();
                    workspaceProcessor.ExtensionsProcessor = extensionsProcessor;
                    workspaceProcessor.LaunchFileProcessor = debugSettingsProcessor;
                    workspaceProcessor.SettingsProcessor = settingsProcessor;
                    workspaceProcessor.TasksProcessor = tasksProcessor;
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
                    Assert.strictEqual(await component.ExtensionsMetadata, randomExtensions);
                    Assert.strictEqual(await component.LaunchMetadata, randomDebugSettings);
                    Assert.strictEqual(await component.SettingsMetadata, randomSettings);
                    Assert.strictEqual(await component.TasksMetadata, randomTasks);
                });

            test(
                "Checking whether processors are executed only if the corresponding property exists…",
                async () =>
                {
                    Assert.strictEqual(await component.ExtensionsMetadata, randomExtensions);
                    delete (await workspaceLoader.WorkspaceMetadata).extensions;
                    Assert.notStrictEqual(await component.ExtensionsMetadata, randomExtensions);
                    Assert.ok(isNullOrUndefined(await component.ExtensionsMetadata));
                });
        });
}
