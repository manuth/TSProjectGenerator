import Assert = require("assert");
import { FileMappingTester, ITestGeneratorOptions, ITestOptions, TestGenerator } from "@manuth/extended-yo-generator-test";
import { TempDirectory } from "@manuth/temp-files";
import { WorkspaceFolderLoader } from "../../../VSCode/FileMappings/WorkspaceFolderLoader";
import { IExtensionSettings } from "../../../VSCode/IExtensionSettings";
import { ILaunchSettings } from "../../../VSCode/ILaunchSettings";
import { ITaskSettings } from "../../../VSCode/ITaskSettings";
import { TestContext } from "../../TestContext";
import { TestCodeWorkspaceComponent } from "../Components/TestCodeWorkspaceComponent";

/**
 * Registers tests for the `WorkspaceFolderLoader` class.
 *
 * @param context
 * The test-context.
 */
export function WorkspaceFolderLoaderTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "WorkspaceFolderLoader",
        () =>
        {
            let generator: TestGenerator;
            let moduleRoot: string;
            let destinationRoot: string;
            let tempDir: TempDirectory;
            let randomExtensions: IExtensionSettings;
            let randomLaunchSettings: ILaunchSettings;
            let randomSettings: Record<string, any>;
            let randomTasks: ITaskSettings;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    generator = await context.Generator;
                    moduleRoot = generator.moduleRoot();
                    destinationRoot = generator.destinationRoot();
                    tempDir = new TempDirectory();
                    generator.moduleRoot(tempDir.FullName);
                    generator.destinationRoot(tempDir.FullName);
                });

            suiteTeardown(
                () =>
                {
                    generator.moduleRoot(moduleRoot);
                    generator.destinationRoot(destinationRoot);
                });

            setup(
                async () =>
                {
                    randomExtensions = context.RandomObject;
                    randomLaunchSettings = context.RandomObject;
                    randomSettings = context.RandomObject;
                    randomTasks = context.RandomObject;

                    let component = new TestCodeWorkspaceComponent(generator);
                    let workspace = await component.Source.WorkspaceMetadata;
                    workspace.extensions = randomExtensions;
                    workspace.launch = randomLaunchSettings;
                    workspace.settings = randomSettings;
                    workspace.tasks = randomTasks;

                    for (let fileMappingOptions of component.FileMappings)
                    {
                        await new FileMappingTester(generator, fileMappingOptions).Run();
                    }
                });

            test(
                "Checking whether files are read correctly…",
                async () =>
                {
                    let folderLoader = new WorkspaceFolderLoader(new TestCodeWorkspaceComponent(generator));
                    Assert.deepStrictEqual(await folderLoader.ExtensionsMetadata, randomExtensions);
                    Assert.deepStrictEqual(await folderLoader.LaunchMetadata, randomLaunchSettings);
                    Assert.deepStrictEqual(await folderLoader.SettingsMetadata, randomSettings);
                    Assert.deepStrictEqual(await folderLoader.TasksMetadata, randomTasks);
                });
        });
}
