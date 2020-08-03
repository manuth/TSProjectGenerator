import Assert = require("assert");
import { TestContext } from "@manuth/extended-yo-generator-test";
import { ITSProjectSettings } from "../../../../Project/Settings/ITSProjectSettings";
import { TSModuleWorkspaceFolder } from "../../../../generators/module/Components/TSModuleWorkspaceFolder";
import { TSModuleGenerator } from "../../../../generators/module/TSModuleGenerator";
import { TSModuleLaunchFileProcessor } from "../../../../generators/module/VSCode/TSModuleLaunchFileProcessor";

/**
 * Registers tests for the `TSModuleLaunchFileProcessor` class.
 *
 * @param context
 * The test-context.
 */
export function TSModuleLaunchFileProcessorTests(context: TestContext<TSModuleGenerator>): void
{
    suite.only(
        "TSModuleLaunchFileProcessor",
        () =>
        {
            let component: TSModuleWorkspaceFolder<ITSProjectSettings>;
            let processor: TSModuleLaunchFileProcessor<ITSProjectSettings>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    component = new TSModuleWorkspaceFolder(await context.Generator);
                    processor = new TSModuleLaunchFileProcessor(component);
                });

            test(
                "Checking whether a configuration for launching the program is present…",
                async () =>
                {
                    let launchConfig = await processor.Process(await component.SourceDebugSettings);
                    let debugConfigs = launchConfig.configurations ?? [];

                    Assert.ok(
                        debugConfigs.some(
                            (debugConfig) =>
                            {
                                return debugConfig.name === "Launch Program";
                            }));
                });
        });
}
