import Assert = require("assert");
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { ITSProjectSettings } from "../../../../Project/Settings/ITSProjectSettings";
import { TSModuleCodeWorkspace } from "../../../../generators/module/Components/TSModuleCodeWorkspace";
import { TSModuleGenerator } from "../../../../generators/module/TSModuleGenerator";
import { TSModuleLaunchFileProcessor } from "../../../../generators/module/VSCode/TSModuleLaunchFileProcessor";
import { TestContext } from "../../../TestContext";

/**
 * Registers tests for the `TSModuleLaunchFileProcessor` class.
 *
 * @param context
 * The test-context.
 */
export function TSModuleLaunchFileProcessorTests(context: TestContext<TSModuleGenerator>): void
{
    suite(
        "TSModuleLaunchFileProcessor",
        () =>
        {
            let component: TSModuleCodeWorkspace<ITSProjectSettings, GeneratorOptions>;
            let processor: TSModuleLaunchFileProcessor<ITSProjectSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    component = new TSModuleCodeWorkspace(await context.Generator);
                    processor = new TSModuleLaunchFileProcessor(component);
                });

            test(
                "Checking whether a configuration for launching the program is present…",
                async () =>
                {
                    let launchConfig = await processor.Process(await component.Source.LaunchMetadata);
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
