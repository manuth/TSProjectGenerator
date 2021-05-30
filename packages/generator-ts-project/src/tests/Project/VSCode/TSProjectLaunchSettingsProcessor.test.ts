import { ok, strictEqual } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { join, normalize } from "upath";
import { TSProjectCodeWorkspaceFolder } from "../../../Project/Components/TSProjectCodeWorkspaceFolder";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";
import { TSProjectLaunchSettingsProcessor } from "../../../Project/VSCode/TSProjectLaunchSettingsProcessor";
import { ILaunchSettings } from "../../../VSCode/ILaunchSettings";
import { TestContext } from "../../TestContext";

/**
 * Registers tests for the `TSProjectLaunchSettingsProcessor` class.
 *
 * @param context
 * The test-context.
 */
export function TSProjectLaunchSettingsProcessorTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        "TSProjectLaunchSettingsProcessor",
        () =>
        {
            let cwdOption: string;
            let programOption: string;
            let argsOption: string;
            let outFilesOption: string;
            let component: TSProjectCodeWorkspaceFolder<ITSProjectSettings, GeneratorOptions>;
            let processor: TSProjectLaunchSettingsProcessor<ITSProjectSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    cwdOption = "cwd";
                    programOption = "program";
                    argsOption = "args";
                    outFilesOption = "outFiles";
                    component = new TSProjectCodeWorkspaceFolder(await context.Generator);
                    processor = new TSProjectLaunchSettingsProcessor(component);
                });

            test(
                "Checking whether `yeoman` debug-configurations are not present…",
                async () =>
                {
                    let launchSettings = await processor.Process(await component.Source.LaunchMetadata);

                    ok(
                        launchSettings.configurations.every(
                            (debugConfig) => !normalize(debugConfig.program ?? "").toLowerCase().endsWith(
                                join("yo", "lib", "cli.js"))));
                });

            test(
                "Checking whether unnecessary settings are being removed…",
                async () =>
                {
                    let launchSettings = await processor.Process(await component.Source.LaunchMetadata);

                    ok(
                        launchSettings.configurations.every(
                            (debugConfig) =>
                            {
                                return (
                                    debugConfig.presentation === undefined &&
                                    debugConfig.autoAttachChildProcesses === undefined &&
                                    debugConfig.SkipFiles === undefined);
                            }));
                });

            test(
                "Checking whether named workspace-directives are stripped properly…",
                async () =>
                {
                    let folderName = context.RandomString;
                    let namedPath = join(context.NamedWorkspaceFolderDirective, folderName);
                    let path = join(context.WorkspaceFolderDirective, folderName);

                    let testSettings: ILaunchSettings = {
                        version: "",
                        configurations: [
                            {
                                type: "",
                                name: programOption,
                                request: "",
                                [programOption]: namedPath
                            },
                            {
                                type: "",
                                name: argsOption,
                                request: "",
                                [argsOption]: [
                                    namedPath
                                ]
                            },
                            {
                                type: "",
                                name: cwdOption,
                                request: "",
                                [cwdOption]: namedPath
                            },
                            {
                                type: "",
                                name: outFilesOption,
                                request: "",
                                [outFilesOption]: [
                                    namedPath
                                ]
                            }
                        ]
                    };

                    let processedSettings = await processor.Process(testSettings);

                    for (let name of [programOption, argsOption, cwdOption])
                    {
                        let debugConfig = processedSettings.configurations.find((config) => config.name === name);
                        let actual: string;

                        switch (debugConfig.name)
                        {
                            case programOption:
                                actual = debugConfig[programOption];
                                break;
                            case argsOption:
                                actual = debugConfig[argsOption][0];
                                break;
                            case cwdOption:
                                actual = debugConfig.cwd;
                                break;
                            case outFilesOption:
                                actual = debugConfig[outFilesOption][0];
                                break;
                        }

                        strictEqual(actual, path);
                    }
                });
        });
}
