import { notStrictEqual, ok, strictEqual } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { ITestGeneratorOptions, ITestGeneratorSettings, ITestOptions, TestGenerator } from "@manuth/extended-yo-generator-test";
import { IExtensionSettings } from "../../VSCode/IExtensionSettings";
import { ILaunchSettings } from "../../VSCode/ILaunchSettings";
import { ITaskSettings } from "../../VSCode/ITaskSettings";
import { TestJSONProcessor } from "../Components/TestJSONProcessor";
import { TestContext } from "../TestContext";
import { TestCodeWorkspaceComponent } from "./Components/TestCodeWorkspaceComponent";
import { TestWorkspaceProcessor } from "./Components/TestWorkspaceProcessor";
import { TestCodeWorkspaceProvider } from "./FileMappings/TestCodeWorkspaceProvider";

/**
 * Registers tests for the `WorkspaceProcessor` class.
 *
 * @param context
 * The test-context.
 */
export function WorkspaceProcessorTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "WorkspaceProcessor",
        () =>
        {
            let component: TestCodeWorkspaceComponent<ITestGeneratorSettings, GeneratorOptions>;
            let workspaceProcessor: TestWorkspaceProcessor<ITestGeneratorSettings, GeneratorOptions>;
            let randomExtensions: IExtensionSettings;
            let randomDebugSettings: ILaunchSettings;
            let randomSettings: Record<string, any>;
            let randomTasks: ITaskSettings;
            let workspaceLoader: TestCodeWorkspaceProvider<ITestGeneratorSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(10 * 1000);
                    component = new TestCodeWorkspaceComponent(await context.Generator);
                    workspaceLoader = new TestCodeWorkspaceProvider(component);
                    component.Source = workspaceLoader;
                    workspaceProcessor = new TestWorkspaceProcessor(component);
                    component.WorkspaceProcessor = workspaceProcessor;
                });

            setup(
                async () =>
                {
                    randomExtensions = context.RandomObject;
                    randomDebugSettings = context.RandomObject;
                    randomSettings = context.RandomObject;
                    randomTasks = context.RandomObject;

                    let extensionsProcessor = new TestJSONProcessor<ITestGeneratorSettings, GeneratorOptions>(randomExtensions);
                    let debugSettingsProcessor = new TestJSONProcessor<ITestGeneratorSettings, GeneratorOptions>(randomDebugSettings);
                    let settingsProcessor = new TestJSONProcessor<ITestGeneratorSettings, GeneratorOptions>(randomSettings);
                    let tasksProcessor = new TestJSONProcessor<ITestGeneratorSettings, GeneratorOptions>(randomTasks);

                    let workspace = await workspaceLoader.WorkspaceMetadata;
                    workspace.extensions = context.RandomObject;
                    workspace.launch = context.RandomObject;
                    workspace.settings = context.RandomObject;
                    workspace.tasks = context.RandomObject;
                    workspaceProcessor.ExtensionsProcessor = extensionsProcessor;
                    workspaceProcessor.LaunchSettingsProcessor = debugSettingsProcessor;
                    workspaceProcessor.SettingsProcessor = settingsProcessor;
                    workspaceProcessor.TasksProcessor = tasksProcessor;
                });

            test(
                "Checking whether custom processors can be injected…",
                async () =>
                {
                    strictEqual(await component.ExtensionsMetadata, randomExtensions);
                    strictEqual(await component.LaunchMetadata, randomDebugSettings);
                    strictEqual(await component.SettingsMetadata, randomSettings);
                    strictEqual(await component.TasksMetadata, randomTasks);
                });

            test(
                "Checking whether processors are executed only if the corresponding property exists…",
                async () =>
                {
                    strictEqual(await component.ExtensionsMetadata, randomExtensions);
                    delete (await workspaceLoader.WorkspaceMetadata).extensions;
                    notStrictEqual(await component.ExtensionsMetadata, randomExtensions);
                    ok(!await component.ExtensionsMetadata);
                });
        });
}
