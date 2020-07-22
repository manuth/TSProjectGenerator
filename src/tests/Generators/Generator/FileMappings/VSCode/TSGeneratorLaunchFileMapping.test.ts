import Assert = require("assert");
import { GeneratorSettingKey } from "@manuth/extended-yo-generator";
import { TestContext } from "@manuth/extended-yo-generator-test";
import { DebugConfiguration } from "vscode";
import { TSProjectComponent } from "../../../../../Project/Settings/TSProjectComponent";
import { CodeWorkspaceComponent } from "../../../../../VSCode/Components/CodeWorkspaceComponent";
import { ILaunchFile } from "../../../../../VSCode/ILaunchFile";
import { TSGeneratorLaunchFileMapping } from "../../../../../generators/generator/FileMappings/VSCode/TSGeneratorLaunchFileMapping";
import { ITSGeneratorSettings } from "../../../../../generators/generator/Settings/ITSGeneratorSettings";
import { SubGeneratorSettingKey } from "../../../../../generators/generator/Settings/SubGeneratorSettingKey";
import { TSGeneratorComponent } from "../../../../../generators/generator/Settings/TSGeneratorComponent";
import { TSGeneratorSettingKey } from "../../../../../generators/generator/Settings/TSGeneratorSettingKey";
import { TSGeneratorGenerator } from "../../../../../generators/generator/TSGeneratorGenerator";
import { VSCodeJSONFileMappingTester } from "../../../../VSCode/FileMappings/VSCodeJSONFileMappingTester";

/**
 * Registers tests for the `TSGeneratorLaunchFileMapping` class.
 *
 * @param context
 * The test-context.
 */
export function TSGeneratorLaunchFileMappingTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        "TSGeneratorLaunchFileMapping",
        () =>
        {
            let settings: ITSGeneratorSettings;
            let fileMappingOptions: TSGeneratorLaunchFileMapping<ITSGeneratorSettings>;
            let tester: VSCodeJSONFileMappingTester<TSGeneratorGenerator, ITSGeneratorSettings, TSGeneratorLaunchFileMapping<ITSGeneratorSettings>>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);

                    settings = {
                        ...(await context.Generator).Settings,
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

                    let runContext = context.ExecuteGenerator();
                    runContext.withPrompts(settings);
                    await runContext.toPromise();
                    fileMappingOptions = new TSGeneratorLaunchFileMapping(new CodeWorkspaceComponent(runContext.generator));
                    tester = new VSCodeJSONFileMappingTester(runContext.generator, fileMappingOptions);
                });

            test(
                "Checking whether the generated file is present…",
                async () =>
                {
                    Assert.ok(await tester.Exists);
                });

            test(
                "Checking whether a launch-configuration for each generator is present…",
                async () =>
                {
                    let launchFile: ILaunchFile = await tester.MetaData;
                    let debugConfigs: DebugConfiguration[] = launchFile.configurations ?? [];

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
