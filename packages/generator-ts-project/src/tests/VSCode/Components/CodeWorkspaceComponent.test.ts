import Assert = require("assert");
import { TestGenerator, ITestGeneratorSettings } from "@manuth/extended-yo-generator-test";
import { Random } from "random-js";
import { IWorkspaceMetadata } from "../../../VSCode/IWorkspaceMetadata";
import { TestJSONProcessor } from "../../Components/TestJSONProcessor";
import { TestContext } from "../../TestContext";
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
            let randomWorkspace: IWorkspaceMetadata;
            let component: TestCodeWorkspaceComponent<ITestGeneratorSettings>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    random = new Random();
                    component = new TestCodeWorkspaceComponent(await context.Generator);
                });

            setup(
                () =>
                {
                    randomWorkspace = {
                        folders: [],
                        extensions: RandomData(),
                        launch: RandomData(),
                        settings: RandomData(),
                        tasks: RandomData()
                    };

                    component.WorkspaceProcessor = new TestJSONProcessor(randomWorkspace);
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
                "Checking whether a custom workspace-processor can be injected…",
                async () =>
                {
                    Assert.strictEqual(await component.WorkspaceMetadata, randomWorkspace);
                });

            test(
                "Checking whether the workspace-object is read correctly…",
                async () =>
                {
                    Assert.strictEqual(await component.ExtensionsMetadata, randomWorkspace.extensions);
                    Assert.strictEqual(await component.LaunchMetadata, randomWorkspace.launch);
                    Assert.strictEqual(await component.SettingsMetadata, randomWorkspace.settings);
                    Assert.strictEqual(await component.TasksMetadata, randomWorkspace.tasks);
                });
        });
}
