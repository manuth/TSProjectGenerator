import Assert = require("assert");
import { TestContext } from "@manuth/extended-yo-generator-test";
import { TSProjectCodeWorkspaceComponent } from "../../../../Project/Components/TSProjectCodeWorkspaceComponent";
import { TSProjectLaunchFileMapping } from "../../../../Project/FileMappings/VSCode/TSProjectLaunchFileMapping";
import { ITSProjectSettings } from "../../../../Project/Settings/ITSProjectSettings";
import { TSProjectGenerator } from "../../../../Project/TSProjectGenerator";
import { ILaunchFile } from "../../../../VSCode/ILaunchFile";
import { JSONFileMappingTester } from "../../../Components/JSONFileMappingTester";

/**
 * Registers tests for the `TSProjectLaunchFileMapping` class.
 *
 * @param context
 * The test-context.
 */
export function TSProjectLaunchFileMappingTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        "TSProjectLaunchFileMapping",
        () =>
        {
            let fileMapping: TSProjectLaunchFileMapping<ITSProjectSettings>;
            let tester: JSONFileMappingTester<TSProjectGenerator, ITSProjectSettings, TSProjectLaunchFileMapping<ITSProjectSettings>>;

            suiteSetup(
                async function()
                {
                    fileMapping = new TSProjectLaunchFileMapping(new TSProjectCodeWorkspaceComponent(await context.Generator));
                    tester = new JSONFileMappingTester(await context.Generator, fileMapping);
                });

            test(
                "Checking whether `yeoman` debug-configurations are not present…",
                async () =>
                {
                    let launchFile: ILaunchFile = await tester.Metadata;

                    Assert.ok(
                        launchFile.configurations.every(
                            (debugConfig) => !debugConfig.name.toLowerCase().includes("yeoman")));
                });
        });
}
