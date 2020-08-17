import Assert = require("assert");
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { TSProjectWorkspaceFolder } from "../../../Project/Components/TSProjectCodeWorkspaceComponent";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";
import { TSProjectLaunchFileProcessor } from "../../../Project/VSCode/TSProjectLaunchFileProcessor";
import { ILaunchSettings } from "../../../VSCode/ILaunchSettings";
import { TestContext } from "../../TestContext";

/**
 * Registers tests for the `TSProjectLaunchFileProcessor` class.
 *
 * @param context
 * The test-context.
 */
export function TSProjectLaunchFileProcessorTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        "TSProjectLaunchFileProcessor",
        () =>
        {
            let component: TSProjectWorkspaceFolder<ITSProjectSettings, GeneratorOptions>;
            let processor: TSProjectLaunchFileProcessor<ITSProjectSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    component = new TSProjectWorkspaceFolder(await context.Generator);
                    processor = new TSProjectLaunchFileProcessor(component);
                });

            test(
                "Checking whether `yeoman` debug-configurations are not present…",
                async () =>
                {
                    let launchFile = await processor.Process(await component.Source.LaunchMetadata);

                    Assert.ok(
                        launchFile.configurations.every(
                            (debugConfig) => !debugConfig.name.toLowerCase().includes("yeoman")));
                });

            test(
                "Checking whether named workspace-directives are stripped properly…",
                async () =>
                {
                    let programName = "program";
                    let argsName = "args";
                    let cwdName = "cwd";

                    let testData: ILaunchSettings = {
                        version: "",
                        configurations: [
                            {
                                type: "",
                                name: programName,
                                request: "",
                                program: context.NamedWorkspaceFolderDirective
                            },
                            {
                                type: "",
                                name: argsName,
                                request: "",
                                args: [
                                    context.NamedWorkspaceFolderDirective
                                ]
                            },
                            {
                                type: "",
                                name: cwdName,
                                request: "",
                                cwd: context.NamedWorkspaceFolderDirective
                            }
                        ]
                    };

                    let processedData = await processor.Process(testData);

                    for (let name of [programName, argsName, cwdName])
                    {
                        let debugConfig = processedData.configurations.find((config) => config.name === name);
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

                        Assert.strictEqual(actual, context.WorkspaceFolderDirective);
                    }
                });
        });
}
