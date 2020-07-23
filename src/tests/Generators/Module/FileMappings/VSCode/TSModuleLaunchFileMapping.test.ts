import Assert = require("assert");
import { TestContext } from "@manuth/extended-yo-generator-test";
import { ITSProjectSettings } from "../../../../../Project/Settings/ITSProjectSettings";
import { ILaunchFile } from "../../../../../VSCode/ILaunchFile";
import TSModuleGenerator = require("../../../../../generators/module");
import { TSModuleCodeWorkspace } from "../../../../../generators/module/Components/TSModuleCodeWorkspace";
import { TSModuleLaunchFileMapping } from "../../../../../generators/module/FileMappings/VSCode/TSModuleLaunchFileMapping";
import { VSCodeJSONFileMappingTester } from "../../../../VSCode/FileMappings/VSCodeJSONFileMappingTester";

/**
 * Registers tests for the `TSModuleLaunchFileMapping` class.
 *
 * @param context
 * The test-context.
 */
export function TSModuleLaunchFileMappingTests(context: TestContext<TSModuleGenerator>): void
{
    suite(
        "TSModuleLaunchFileMapping",
        () =>
        {
            let fileMapping: TSModuleLaunchFileMapping<ITSProjectSettings>;
            let tester: VSCodeJSONFileMappingTester<TSModuleGenerator, ITSProjectSettings, TSModuleLaunchFileMapping<ITSProjectSettings>>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    fileMapping = new TSModuleLaunchFileMapping(new TSModuleCodeWorkspace(await context.Generator));
                    tester = new VSCodeJSONFileMappingTester(await context.Generator, fileMapping);
                });

            test(
                "Checking whether a configuration for launching the program is present…",
                async () =>
                {
                    let launchConfig: ILaunchFile = await tester.Metadata;

                    Assert.ok(
                        launchConfig.configurations.some(
                            (debugConfig) =>
                            {
                                return debugConfig.name === "Launch Program";
                            }));
                });
        });
}
