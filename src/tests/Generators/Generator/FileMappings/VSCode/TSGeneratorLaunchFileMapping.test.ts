import Assert = require("assert");
import { GeneratorSettingKey } from "@manuth/extended-yo-generator";
import { TestContext, IRunContext } from "@manuth/extended-yo-generator-test";
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
import { JSONFileMappingTester } from "../../../../Components/JSONFileMappingTester";

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
            let settings: Partial<ITSGeneratorSettings>;
            let fileMappingOptions: TSGeneratorLaunchFileMapping<ITSGeneratorSettings>;
            let tester: JSONFileMappingTester<TSGeneratorGenerator, ITSGeneratorSettings, TSGeneratorLaunchFileMapping<ITSGeneratorSettings>>;

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

                    fileMappingOptions = new TSGeneratorLaunchFileMapping(new CodeWorkspaceComponent(await context.Generator));
                    tester = new JSONFileMappingTester(await context.Generator, fileMappingOptions);
                });

            setup(
                () =>
                {
                    Object.assign(tester.Generator.Settings, settings);
                });

            test(
                "Checking whether the generated file is present…",
                async () =>
                {
                    await tester.Run();
                    Assert.ok(await tester.Exists);
                });

            test(
                "Checking whether a launch-configuration for each generator is present…",
                async () =>
                {
                    let launchFile: ILaunchFile = await tester.Metadata;
                    let debugConfigs: DebugConfiguration[] = launchFile.configurations ?? [];
                    await tester.Run();

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
