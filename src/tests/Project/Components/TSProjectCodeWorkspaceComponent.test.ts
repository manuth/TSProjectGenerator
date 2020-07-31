import Assert = require("assert");
import { TestContext } from "@manuth/extended-yo-generator-test";
import { TSProjectCodeWorkspaceComponent } from "../../../Project/Components/TSProjectCodeWorkspaceComponent";
import { TSProjectExtensionsMapping } from "../../../Project/FileMappings/VSCode/TSProjectExtensionsMapping";
import { TSProjectLaunchFileMapping } from "../../../Project/FileMappings/VSCode/TSProjectLaunchFileMapping";
import { TSProjectSettingsFileMapping } from "../../../Project/FileMappings/VSCode/TSProjectSettingsFileMapping";
import { TSProjectTasksFileMapping } from "../../../Project/FileMappings/VSCode/TSProjectTasksFileMapping";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";

/**
 * Registers tests for the `TSProjectCodeWorkspaceComponent` class.
 *
 * @param context
 * The test-context.
 */
export function TSProjectCodeWorkspaceComponentTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        "TSProjectCodeWorkspaceComponent",
        () =>
        {
            let component: TSProjectCodeWorkspaceComponent<ITSProjectSettings>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    component = new TSProjectCodeWorkspaceComponent(await context.Generator);
                });

            test(
                "Checking whether all necessary file-mappings are present…",
                async () =>
                {
                    let fileMappingTypes = [
                        TSProjectExtensionsMapping,
                        TSProjectLaunchFileMapping,
                        TSProjectSettingsFileMapping,
                        TSProjectTasksFileMapping
                    ];

                    for (let fileMappingType of fileMappingTypes)
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
