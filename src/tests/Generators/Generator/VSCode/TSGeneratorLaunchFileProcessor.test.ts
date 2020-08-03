import Assert = require("assert");
import { GeneratorSettingKey } from "@manuth/extended-yo-generator";
import { TestContext } from "@manuth/extended-yo-generator-test";
import { TSProjectComponent } from "../../../../Project/Settings/TSProjectComponent";
import { CodeWorkspaceComponent } from "../../../../VSCode/Components/CodeWorkspaceComponent";
import { WorkspaceFolderComponent } from "../../../../VSCode/Components/WorkspaceFolderComponent";
import { ITSGeneratorSettings } from "../../../../generators/generator/Settings/ITSGeneratorSettings";
import { SubGeneratorSettingKey } from "../../../../generators/generator/Settings/SubGeneratorSettingKey";
import { TSGeneratorComponent } from "../../../../generators/generator/Settings/TSGeneratorComponent";
import { TSGeneratorSettingKey } from "../../../../generators/generator/Settings/TSGeneratorSettingKey";
import { TSGeneratorGenerator } from "../../../../generators/generator/TSGeneratorGenerator";
import { TSGeneratorLaunchFileProcessor } from "../../../../generators/generator/VSCode/TSGeneratorLaunchFileProcessor";

/**
 * Registers tests for the `TSGeneratorLaunchFileProcessor` class.
 *
 * @param context
 * The test-context.
 */
export function TSGeneratorLaunchFileProcessorTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite.only(
        "TSGeneratorLaunchFileProcessor",
        () =>
        {
            let settings: Partial<ITSGeneratorSettings>;
            let component: CodeWorkspaceComponent<ITSGeneratorSettings>;
            let processor: TSGeneratorLaunchFileProcessor<ITSGeneratorSettings>;

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

                    component = new WorkspaceFolderComponent(await context.Generator);
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
                    let launchFile = await processor.Process(await component.SourceDebugSettings);
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
