import { strictEqual } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { ITestGeneratorOptions, ITestGeneratorSettings, ITestOptions, TestGenerator } from "@manuth/extended-yo-generator-test";
import type { CodeWorkspaceComponent } from "../../../VSCode/Components/CodeWorkspaceComponent";
import { IWorkspaceMetadata } from "../../../VSCode/IWorkspaceMetadata";
import { TestJSONProcessor } from "../../Components/TestJSONProcessor";
import { TestContext } from "../../TestContext";
import { TestCodeWorkspaceComponent } from "./TestCodeWorkspaceComponent";

/**
 * Registers tests for the {@link CodeWorkspaceComponent `CodeWorkspaceComponent<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function CodeWorkspaceComponentTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        nameof<CodeWorkspaceComponent<any, any>>(),
        () =>
        {
            let randomWorkspace: IWorkspaceMetadata;
            let component: TestCodeWorkspaceComponent<ITestGeneratorSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    component = new TestCodeWorkspaceComponent(await context.Generator);
                });

            setup(
                () =>
                {
                    randomWorkspace = {
                        folders: [],
                        extensions: context.RandomObject,
                        launch: context.RandomObject,
                        settings: context.RandomObject,
                        tasks: context.RandomObject
                    };

                    component.WorkspaceProcessor = new TestJSONProcessor(randomWorkspace);
                });

            suite(
                nameof<TestCodeWorkspaceComponent<any, any>>((component) => component.WorkspaceProcessor),
                () =>
                {
                    test(
                        "Checking whether a custom workspace-processor can be injected…",
                        async () =>
                        {
                            strictEqual(await component.GetWorkspaceMetadata(), randomWorkspace);
                        });

                    test(
                        "Checking whether the workspace-object is read correctly…",
                        async () =>
                        {
                            strictEqual(await component.GetExtensionsMetadata(), randomWorkspace.extensions);
                            strictEqual(await component.GetLaunchMetadata(), randomWorkspace.launch);
                            strictEqual(await component.GetSettingsMetadata(), randomWorkspace.settings);
                            strictEqual(await component.GetTasksMetadata(), randomWorkspace.tasks);
                        });
                });
        });
}
