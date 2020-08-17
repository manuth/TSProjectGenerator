import Assert = require("assert");
import { GeneratorOptions, GeneratorSettingKey } from "@manuth/extended-yo-generator";
import { TSProjectComponent } from "../../../../Project/Settings/TSProjectComponent";
import { CodeWorkspaceComponent } from "../../../../VSCode/Components/CodeWorkspaceComponent";
import { TSGeneratorCodeWorkspace } from "../../../../generators/generator/Components/TSGeneratorCodeWorkspace";
import { ITSGeneratorSettings } from "../../../../generators/generator/Settings/ITSGeneratorSettings";
import { SubGeneratorSettingKey } from "../../../../generators/generator/Settings/SubGeneratorSettingKey";
import { TSGeneratorComponent } from "../../../../generators/generator/Settings/TSGeneratorComponent";
import { TSGeneratorSettingKey } from "../../../../generators/generator/Settings/TSGeneratorSettingKey";
import { TSGeneratorGenerator } from "../../../../generators/generator/TSGeneratorGenerator";
import { TSGeneratorLaunchFileProcessor } from "../../../../generators/generator/VSCode/TSGeneratorLaunchFileProcessor";
import { TestContext } from "../../../TestContext";

/**
 * Registers tests for the `TSGeneratorLaunchFileProcessor` class.
 *
 * @param context
 * The test-context.
 */
export function TSGeneratorLaunchFileProcessorTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        "TSGeneratorLaunchFileProcessor",
        () =>
        {
            let settings: Partial<ITSGeneratorSettings>;
            let component: CodeWorkspaceComponent<ITSGeneratorSettings, GeneratorOptions>;
            let processor: TSGeneratorLaunchFileProcessor<ITSGeneratorSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);

                    settings = {
                        [GeneratorSettingKey.Components]: [
                            TSProjectComponent.VSCode,
                            TSGeneratorComponent.GeneratorExample,
                            TSGeneratorComponent.SubGeneratorExample
                        ],
                        [TSGeneratorSettingKey.SubGenerators]: [
                            {
                                [SubGeneratorSettingKey.DisplayName]: "A",
                                [SubGeneratorSettingKey.Name]: "a"
                            },
                            {
                                [SubGeneratorSettingKey.DisplayName]: "B",
                                [SubGeneratorSettingKey.Name]: "b"
                            }
                        ]
                    };

                    component = new TSGeneratorCodeWorkspace(await context.Generator);
                    processor = new TSGeneratorLaunchFileProcessor(component);
                });

            setup(
                () =>
                {
                    Object.assign(processor.Generator.Settings, settings);
                });

            test(
                "Checking whether a launch-configuration for each generator is present…",
                async () =>
                {
                    let launchFile = await processor.Process(await component.Source.LaunchMetadata);
                    let debugConfigs = launchFile.configurations ?? [];

                    Assert.ok(
                        debugConfigs.some(
                            (debugConfig) =>
                            {
                                return debugConfig.name === "Launch Yeoman";
                            }));

                    Assert.ok(
                        settings[TSGeneratorSettingKey.SubGenerators].every(
                            (subGeneratorOptions) =>
                            {
                                return debugConfigs.some(
                                    (debugConfig) =>
                                    {
                                        return debugConfig.name.includes(`${subGeneratorOptions[SubGeneratorSettingKey.DisplayName]} generator`);
                                    });
                            }));
                });
        });
}
