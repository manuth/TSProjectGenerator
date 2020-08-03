import Assert = require("assert");
import { TestContext } from "@manuth/extended-yo-generator-test";
import { TSProjectWorkspaceFolder } from "../../../Project/Components/TSProjectCodeWorkspaceComponent";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";
import { TSProjectLaunchFileProcessor } from "../../../Project/VSCode/TSProjectLaunchFileProcessor";

/**
 * Registers tests for the `TSProjectLaunchFileProcessor` class.
 *
 * @param context
 * The test-context.
 */
export function TSProjectLaunchFileProcessorTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        "TSProjectLaunchFileProcessor",
        () =>
        {
            let component: TSProjectWorkspaceFolder<ITSProjectSettings>;
            let processor: TSProjectLaunchFileProcessor<ITSProjectSettings>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    component = new TSProjectWorkspaceFolder(await context.Generator);
                    processor = new TSProjectLaunchFileProcessor(component);
                });

            test(
                "Checking whether `yeoman` debug-configurations are not present…",
                async () =>
                {
                    let launchFile = await processor.Process(await component.Source.LaunchMetadata);

                    Assert.ok(
                        launchFile.configurations.every(
                            (debugConfig) => !debugConfig.name.toLowerCase().includes("yeoman")));
                });
        });
}
