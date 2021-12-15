import { notStrictEqual, ok, strictEqual } from "assert";
import { GeneratorOptions, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { IExtensionSettings } from "../../VSCode/IExtensionSettings";
import { ILaunchSettings } from "../../VSCode/ILaunchSettings";
import { ITaskSettings } from "../../VSCode/ITaskSettings";
import type { WorkspaceProcessor } from "../../VSCode/WorkspaceProcessor";
import { TestJSONProcessor } from "../Components/TestJSONProcessor";
import { TestContext } from "../TestContext";
import { TestCodeWorkspaceComponent } from "./Components/TestCodeWorkspaceComponent";
import { TestWorkspaceProcessor } from "./Components/TestWorkspaceProcessor";
import { TestCodeWorkspaceProvider } from "./FileMappings/TestCodeWorkspaceProvider";

/**
 * Registers tests for the {@link WorkspaceProcessor `WorkspaceProcessor<TSettings, TOptions>`} class.
 */
export function WorkspaceProcessorTests(): void
{
    suite(
        nameof<WorkspaceProcessor<any, any>>(),
        () =>
        {
            let context = TestContext.Default;
            let component: TestCodeWorkspaceComponent<IGeneratorSettings, GeneratorOptions>;
            let workspaceProcessor: TestWorkspaceProcessor<IGeneratorSettings, GeneratorOptions>;
            let randomExtensions: IExtensionSettings;
            let randomDebugSettings: ILaunchSettings;
            let randomSettings: Record<string, any>;
            let randomTasks: ITaskSettings;
            let workspaceLoader: TestCodeWorkspaceProvider<IGeneratorSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
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

                    let extensionsProcessor = new TestJSONProcessor<IGeneratorSettings, GeneratorOptions>(randomExtensions);
                    let debugSettingsProcessor = new TestJSONProcessor<IGeneratorSettings, GeneratorOptions>(randomDebugSettings);
                    let settingsProcessor = new TestJSONProcessor<IGeneratorSettings, GeneratorOptions>(randomSettings);
                    let tasksProcessor = new TestJSONProcessor<IGeneratorSettings, GeneratorOptions>(randomTasks);

                    let workspace = await workspaceLoader.GetWorkspaceMetadata();
                    workspace.extensions = context.RandomObject;
                    workspace.launch = context.RandomObject;
                    workspace.settings = context.RandomObject;
                    workspace.tasks = context.RandomObject;
                    workspaceProcessor.ExtensionsProcessor = extensionsProcessor;
                    workspaceProcessor.LaunchSettingsProcessor = debugSettingsProcessor;
                    workspaceProcessor.SettingsProcessor = settingsProcessor;
                    workspaceProcessor.TasksProcessor = tasksProcessor;
                });

            suite(
                nameof<WorkspaceProcessor<any, any>>((processor) => processor.Process),
                () =>
                {
                    test(
                        "Checking whether custom processors can be injected…",
                        async () =>
                        {
                            strictEqual(await component.GetExtensionsMetadata(), randomExtensions);
                            strictEqual(await component.GetLaunchMetadata(), randomDebugSettings);
                            strictEqual(await component.GetSettingsMetadata(), randomSettings);
                            strictEqual(await component.GetTasksMetadata(), randomTasks);
                        });

                    test(
                        "Checking whether processors are executed only if the corresponding property exists…",
                        async () =>
                        {
                            strictEqual(await component.GetExtensionsMetadata(), randomExtensions);
                            delete (await workspaceLoader.GetWorkspaceMetadata()).extensions;
                            notStrictEqual(await component.GetExtensionsMetadata(), randomExtensions);
                            ok(!await component.GetExtensionsMetadata());
                        });
                });
        });
}
