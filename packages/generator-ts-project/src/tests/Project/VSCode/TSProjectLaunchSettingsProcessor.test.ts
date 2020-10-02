import { ok, strictEqual } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { join, normalize } from "upath";
import { TSProjectWorkspaceFolder } from "../../../Project/Components/TSProjectCodeWorkspaceComponent";
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
            let component: TSProjectWorkspaceFolder<ITSProjectSettings, GeneratorOptions>;
            let processor: TSProjectLaunchSettingsProcessor<ITSProjectSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    component = new TSProjectWorkspaceFolder(await context.Generator);
                    processor = new TSProjectLaunchSettingsProcessor(component);
                });

            test(
                "Checking whether `yeoman` debug-configurations are not present…",
                async () =>
                {
                    let launchSettings = await processor.Process(await component.Source.LaunchMetadata);

                    ok(
                        launchSettings.configurations.every(
                            (debugConfig) => !normalize(debugConfig.program ?? "").toLowerCase().endsWith("yo/lib/cli.js")));
                });

            test(
                "Checking whether named workspace-directives are stripped properly…",
                async () =>
                {
                    let programName = "program";
                    let argsName = "args";
                    let cwdName = "cwd";
                    let folderName = context.RandomString;
                    let namedPath = join(context.NamedWorkspaceFolderDirective, folderName);
                    let path = join(context.WorkspaceFolderDirective, folderName);

                    let testSettings: ILaunchSettings = {
                        version: "",
                        configurations: [
                            {
                                type: "",
                                name: programName,
                                request: "",
                                program: namedPath
                            },
                            {
                                type: "",
                                name: argsName,
                                request: "",
                                args: [
                                    namedPath
                                ]
                            },
                            {
                                type: "",
                                name: cwdName,
                                request: "",
                                cwd: namedPath
                            }
                        ]
                    };

                    let processedSettings = await processor.Process(testSettings);

                    for (let name of [programName, argsName, cwdName])
                    {
                        let debugConfig = processedSettings.configurations.find((config) => config.name === name);
                        let actual: string;

                        switch (debugConfig.name)
                        {
                            case programName:
                                actual = debugConfig.program;
                                break;
                            case argsName:
                                actual = debugConfig.args[0];
                                break;
                            case cwdName:
                                actual = debugConfig.cwd;
                                break;
                        }

                        strictEqual(actual, path);
                    }
                });
        });
}
