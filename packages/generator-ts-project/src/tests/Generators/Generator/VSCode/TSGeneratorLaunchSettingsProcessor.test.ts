import { ok } from "node:assert";
import { GeneratorOptions, GeneratorSettingKey } from "@manuth/extended-yo-generator";
import { TSGeneratorCodeWorkspaceFolder } from "../../../../generators/generator/Components/TSGeneratorCodeWorkspaceFolder.js";
import { ITSGeneratorSettings } from "../../../../generators/generator/Settings/ITSGeneratorSettings.js";
import { SubGeneratorSettingKey } from "../../../../generators/generator/Settings/SubGeneratorSettingKey.js";
import { TSGeneratorComponent } from "../../../../generators/generator/Settings/TSGeneratorComponent.js";
import { TSGeneratorSettingKey } from "../../../../generators/generator/Settings/TSGeneratorSettingKey.js";
import { TSGeneratorGenerator } from "../../../../generators/generator/TSGeneratorGenerator.js";
import { TSGeneratorLaunchSettingsProcessor } from "../../../../generators/generator/VSCode/TSGeneratorLaunchSettingsProcessor.js";
import { TSProjectComponent } from "../../../../Project/Settings/TSProjectComponent.js";
import { CodeWorkspaceComponent } from "../../../../VSCode/Components/CodeWorkspaceComponent.js";
import { TestContext } from "../../../TestContext.js";

/**
 * Registers tests for the {@link TSGeneratorLaunchSettingsProcessor `TSGeneratorLaunchSettingsProcessor<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function TSGeneratorLaunchSettingsProcessorTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        nameof(TSGeneratorLaunchSettingsProcessor),
        () =>
        {
            let settings: Partial<ITSGeneratorSettings>;
            let component: CodeWorkspaceComponent<ITSGeneratorSettings, GeneratorOptions>;
            let processor: TSGeneratorLaunchSettingsProcessor<ITSGeneratorSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);

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

                    component = new TSGeneratorCodeWorkspaceFolder(await context.Generator);
                    processor = new TSGeneratorLaunchSettingsProcessor(component);
                });

            setup(
                () =>
                {
                    Object.assign(processor.Generator.Settings, settings);
                });

            suite(
                nameof<TSGeneratorLaunchSettingsProcessor<any, any>>((processor) => processor.Process),
                () =>
                {
                    test(
                        "Checking whether a launch-configuration for each generator is present…",
                        async function()
                        {
                            this.timeout(1 * 1000);
                            this.slow(0.5 * 1000);
                            let launchSettings = await processor.Process(await component.Source.GetLaunchMetadata());
                            let debugConfigs = launchSettings.configurations ?? [];

                            ok(
                                debugConfigs.some(
                                    (debugConfig) =>
                                    {
                                        return debugConfig.name === "Launch Yeoman";
                                    }));

                            ok(
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
        });
}
