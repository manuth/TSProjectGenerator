import Assert = require("assert");
import { FileMapping, IFileMapping } from "@manuth/extended-yo-generator";
import { TestContext, TestGenerator, ITestGeneratorSettings } from "@manuth/extended-yo-generator-test";
import { VSCodeExtensionsMapping } from "../../../VSCode/FileMappings/VSCodeExtensionsMapping";
import { VSCodeLaunchFileMapping } from "../../../VSCode/FileMappings/VSCodeLaunchFileMapping";
import { VSCodeSettingsFileMapping } from "../../../VSCode/FileMappings/VSCodeSettingsFileMapping";
import { VSCodeTasksFileMapping } from "../../../VSCode/FileMappings/VSCodeTasksFileMapping";
import { TestCodeWorkspaceComponent } from "./TestCodeWorkspaceComponent";

/**
 * Registers tests for the `CodeWorkspaceComponent` class.
 *
 * @param context
 * The test-context.
 */
export function CodeWorkspaceComponentTests(context: TestContext<TestGenerator>): void
{
    suite.only(
        "CodeWorkspaceComponent",
        () =>
        {
            let generator: TestGenerator;
            let component: TestCodeWorkspaceComponent<ITestGeneratorSettings>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    generator = await context.Generator;
                    component = new TestCodeWorkspaceComponent(generator);
                });

            test(
                "Checking whether a file-mapping vor copying the settings-folder is present…",
                async () =>
                {
                    let settingsFolder = await component.SettingsFolderName;

                    Assert.ok(
                        await (
                            async () =>
                            {
                                for (let fileMappingOptions of await component.FileMappings)
                                {
                                    let fileMapping = new FileMapping(generator, fileMappingOptions);

                                    if (
                                        (await fileMapping.Source === generator.modulePath(settingsFolder)) &&
                                        (await fileMapping.Destination === generator.destinationPath(settingsFolder)))
                                    {
                                        return true;
                                    }
                                }

                                return false;
                            })());
                });

            test(
                "Checking whether all necessary file-mappings are present…",
                async () =>
                {
                    let fileMappingTypes = [
                        VSCodeExtensionsMapping,
                        VSCodeLaunchFileMapping,
                        VSCodeSettingsFileMapping,
                        VSCodeTasksFileMapping
                    ];

                    for (let fileMappingType of fileMappingTypes)
                    {
                        Assert.ok(
                            (await component.FileMappings).some(
                                (fileMapping) => fileMapping instanceof fileMappingType));
                    }
                });

            test(
                "Checking whether custom file-mappings can be provided…",
                async () =>
                {
                    let fileMappingKeys = [
                        "ExtensionsFileMapping",
                        "LaunchFileMapping",
                        "SettingsFileMapping",
                        "TaskFileMapping"
                    ] as const;

                    let testFileMapping: IFileMapping<ITestGeneratorSettings> = {
                        Destination: "This is a test"
                    };

                    for (let fileMappingKey of fileMappingKeys)
                    {
                        component[fileMappingKey] = context.CreatePromise(testFileMapping);
                        Assert.ok((await component.FileMappings).includes(testFileMapping));
                        component[fileMappingKey] = null;
                    }
                });
        });
}
