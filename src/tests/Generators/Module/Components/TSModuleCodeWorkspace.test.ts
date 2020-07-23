import Assert = require("assert");
import { TestContext } from "@manuth/extended-yo-generator-test";
import { ITSProjectSettings } from "../../../../Project/Settings/ITSProjectSettings";
import { TSModuleCodeWorkspace } from "../../../../generators/module/Components/TSModuleCodeWorkspace";
import { TSModuleLaunchFileMapping } from "../../../../generators/module/FileMappings/VSCode/TSModuleLaunchFileMapping";
import { TSModuleGenerator } from "../../../../generators/module/TSModuleGenerator";

/**
 * Registers tests for the `TSModuleCodeWorkspace` class.
 *
 * @param context
 * The test-context.
 */
export function TSModuleCodeWorkspaceTests(context: TestContext<TSModuleGenerator>): void
{
    suite(
        "TSModuleCodeWorkspace",
        () =>
        {
            let component: TSModuleCodeWorkspace<ITSProjectSettings>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    component = new TSModuleCodeWorkspace(await context.Generator);
                });

            test(
                "Checking whether all necessary file-mappings are present…",
                async () =>
                {
                    for (let fileMappingType of [TSModuleLaunchFileMapping])
                    {
                        Assert.ok(
                            (await component.FileMappings).some(
                                (fileMapping) =>
                                {
                                    return fileMapping instanceof fileMappingType;
                                }));
                    }
                });
        });
}
