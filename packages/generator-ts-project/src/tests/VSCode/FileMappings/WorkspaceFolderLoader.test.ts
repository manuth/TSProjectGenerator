import { deepStrictEqual } from "assert";
import { FileMappingTester, TestGenerator } from "@manuth/extended-yo-generator-test";
import { TempDirectory } from "@manuth/temp-files";
import { WorkspaceFolderLoader } from "../../../VSCode/FileMappings/WorkspaceFolderLoader";
import { IExtensionSettings } from "../../../VSCode/IExtensionSettings";
import { ILaunchSettings } from "../../../VSCode/ILaunchSettings";
import { ITaskSettings } from "../../../VSCode/ITaskSettings";
import { TestContext } from "../../TestContext";
import { TestCodeWorkspaceComponent } from "../Components/TestCodeWorkspaceComponent";

/**
 * Registers tests for the {@link WorkspaceFolderLoader `WorkspaceFolderLoader<TSettings, TOptions>`} class.
 */
export function WorkspaceFolderLoaderTests(): void
{
    suite(
        nameof(WorkspaceFolderLoader),
        () =>
        {
            let context = TestContext.Default;
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
                    this.timeout(30 * 1000);
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
                    let workspace = await component.Source.GetWorkspaceMetadata();
                    workspace.extensions = randomExtensions;
                    workspace.launch = randomLaunchSettings;
                    workspace.settings = randomSettings;
                    workspace.tasks = randomTasks;

                    for (let fileMappingOptions of component.FileMappings)
                    {
                        await new FileMappingTester(generator, fileMappingOptions).Run();
                    }
                });

            suite(
                nameof<WorkspaceFolderLoader<any, any>>((loader) => loader.GetWorkspaceMetadata),
                () =>
                {
                    test(
                        "Checking whether files are read correctly…",
                        async function()
                        {
                            this.timeout(1 * 1000);
                            this.slow(0.5 * 1000);
                            let folderLoader = new WorkspaceFolderLoader(new TestCodeWorkspaceComponent(generator));
                            deepStrictEqual((await folderLoader.GetWorkspaceMetadata()).extensions, randomExtensions);
                            deepStrictEqual((await folderLoader.GetWorkspaceMetadata()).launch, randomLaunchSettings);
                            deepStrictEqual((await folderLoader.GetWorkspaceMetadata()).settings, randomSettings);
                            deepStrictEqual((await folderLoader.GetWorkspaceMetadata()).tasks, randomTasks);
                        });
                });
        });
}
