import Assert = require("assert");
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { TSModuleCodeWorkspace } from "../../../../generators/module/Components/TSModuleCodeWorkspace";
import { TSModuleGenerator } from "../../../../generators/module/TSModuleGenerator";
import { TSModuleLaunchSettingsProcessor } from "../../../../generators/module/VSCode/TSModuleLaunchSettingsProcessor";
import { ITSProjectSettings } from "../../../../Project/Settings/ITSProjectSettings";
import { TestContext } from "../../../TestContext";

/**
 * Registers tests for the `TSModuleLaunchSettingsProcessor` class.
 *
 * @param context
 * The test-context.
 */
export function TSModuleLaunchSettingsProcessorTests(context: TestContext<TSModuleGenerator>): void
{
    suite(
        "TSModuleLaunchSettingsProcessor",
        () =>
        {
            let component: TSModuleCodeWorkspace<ITSProjectSettings, GeneratorOptions>;
            let processor: TSModuleLaunchSettingsProcessor<ITSProjectSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    component = new TSModuleCodeWorkspace(await context.Generator);
                    processor = new TSModuleLaunchSettingsProcessor(component);
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
