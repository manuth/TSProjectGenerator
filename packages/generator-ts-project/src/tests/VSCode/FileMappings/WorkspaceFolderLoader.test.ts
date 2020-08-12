import Assert = require("assert");
import { TestGenerator } from "@manuth/extended-yo-generator-test";
import { Random } from "random-js";
import { TempDirectory } from "temp-filesystem";
import { WorkspaceFolderLoader } from "../../../VSCode/FileMappings/WorkspaceFolderLoader";
import { IExtensionFile } from "../../../VSCode/IExtensionFile";
import { ILaunchFile } from "../../../VSCode/ILaunchFile";
import { ITaskFile } from "../../../VSCode/ITaskFile";
import { FileMappingTester } from "../../Components/FileMappingTester";
import { TestContext } from "../../TestContext";
import { TestCodeWorkspaceComponent } from "../Components/TestCodeWorkspaceComponent";

/**
 * Registers tests for the `WorkspaceFolderLoader` class.
 *
 * @param context
 * The test-context.
 */
export function WorkspaceFolderLoaderTests(context: TestContext<TestGenerator>): void
{
    suite(
        "WorkspaceFolderLoader",
        () =>
        {
            let random: Random;
            let generator: TestGenerator;
            let moduleRoot: string;
            let destinationRoot: string;
            let tempDir: TempDirectory;
            let randomExtensions: IExtensionFile;
            let randomLaunchFile: ILaunchFile;
            let randomSettings: Record<string, any>;
            let randomTasks: ITaskFile;

            /**
             * Generates a random object.
             *
             * @returns
             * A random object.
             */
            function RandomData(): any
            {
                return {
                    random: random.string(20)
                };
            }

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    random = new Random();
                    generator = await context.Generator;
                    moduleRoot = generator["moduleRoot"];
                    destinationRoot = generator.destinationRoot();
                    tempDir = new TempDirectory();
                    generator["moduleRoot"] = tempDir.FullName;
                    generator.destinationRoot(tempDir.FullName);
                });

            suiteTeardown(
                () =>
                {
                    tempDir.Dispose();
                    generator["moduleRoot"] = moduleRoot;
                    generator.destinationRoot(destinationRoot);
                });

            setup(
                async () =>
                {
                    randomExtensions = RandomData();
                    randomLaunchFile = RandomData();
                    randomSettings = RandomData();
                    randomTasks = RandomData();

                    let component = new TestCodeWorkspaceComponent(generator);
                    let workspace = await component.Source.WorkspaceMetadata;
                    workspace.extensions = randomExtensions;
                    workspace.launch = randomLaunchFile;
                    workspace.settings = randomSettings;
                    workspace.tasks = randomTasks;

                    for (let fileMappingOptions of await component.FileMappings)
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
                    Assert.deepStrictEqual(await folderLoader.LaunchMetadata, randomLaunchFile);
                    Assert.deepStrictEqual(await folderLoader.SettingsMetadata, randomSettings);
                    Assert.deepStrictEqual(await folderLoader.TasksMetadata, randomTasks);
                });
        });
}
