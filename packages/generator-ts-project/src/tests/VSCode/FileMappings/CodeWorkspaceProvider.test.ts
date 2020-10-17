import { deepStrictEqual, strictEqual } from "assert";
import { GeneratorOptions, IFileMapping } from "@manuth/extended-yo-generator";
import { FileMappingTester, ITestGeneratorOptions, ITestGeneratorSettings, ITestOptions, TestGenerator } from "@manuth/extended-yo-generator-test";
import { TempDirectory } from "@manuth/temp-files";
import dedent = require("dedent");
import { pathExists, remove, writeFile } from "fs-extra";
import { CodeWorkspaceComponent } from "../../../VSCode/Components/CodeWorkspaceComponent";
import { IExtensionSettings } from "../../../VSCode/IExtensionSettings";
import { ILaunchSettings } from "../../../VSCode/ILaunchSettings";
import { ITaskSettings } from "../../../VSCode/ITaskSettings";
import { TestContext } from "../../TestContext";
import { TestCodeWorkspaceProvider } from "./TestCodeWorkspaceProvider";

/**
 * Registers tests for the `CodeWorkspaceProvider` class.
 *
 * @param context
 * The test-context.
 */
export function CodeWorkspaceProviderTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "CodeWorkspaceProvider",
        () =>
        {
            let tempDir: TempDirectory;
            let fileName: string;
            let generator: TestGenerator;
            let fileMappingTester: FileMappingTester<TestGenerator, ITestGeneratorSettings, GeneratorOptions, IFileMapping<ITestGeneratorSettings, GeneratorOptions>>;
            let workspaceProvider: TestCodeWorkspaceProvider<ITestGeneratorSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    tempDir = new TempDirectory();
                    fileName = tempDir.MakePath("temp.txt");
                    generator = await context.Generator;
                    fileMappingTester = new FileMappingTester(generator, { Destination: fileName });
                    workspaceProvider = new TestCodeWorkspaceProvider(new CodeWorkspaceComponent(generator));
                });

            teardown(
                async () =>
                {
                    await fileMappingTester.Clean();

                    if (await pathExists(fileName))
                    {
                        return remove(fileName);
                    }
                });

            suite(
                "General",
                () =>
                {
                    let randomExtensions: IExtensionSettings;
                    let randomLaunchData: ILaunchSettings;
                    let randomSettings: Record<string, any>;
                    let randomTasks: ITaskSettings;

                    setup(
                        () =>
                        {
                            randomExtensions = context.RandomObject;
                            randomLaunchData = context.RandomObject;
                            randomSettings = context.RandomObject;
                            randomTasks = context.RandomObject;
                        });

                    test(
                        "Checking whether the metadata of all components are loaded from `WorkspaceMetadata…",
                        async () =>
                        {
                            workspaceProvider.WorkspaceMetadata = context.CreatePromise(
                                {
                                    folders: [],
                                    extensions: randomExtensions,
                                    launch: randomLaunchData,
                                    settings: randomSettings,
                                    tasks: randomTasks
                                });

                            strictEqual(await workspaceProvider.ExtensionsMetadata, randomExtensions);
                            strictEqual(await workspaceProvider.LaunchMetadata, randomLaunchData);
                            strictEqual(await workspaceProvider.SettingsMetadata, randomSettings);
                            strictEqual(await workspaceProvider.TasksMetadata, randomTasks);
                        });
                });

            suite(
                "ReadJSON",
                () =>
                {
                    let randomData: any;

                    setup(
                        () =>
                        {
                            randomData = context.RandomObject;
                        });

                    test(
                        "Checking whether files are read from the file-system correctly…",
                        async () =>
                        {
                            await writeFile(fileName, JSON.stringify(randomData));
                            await fileMappingTester.Commit();
                            generator.fs.exists(fileName);
                            deepStrictEqual(await workspaceProvider.ReadJSON(fileName), randomData);
                        });

                    test(
                        "Checking whether files containing comments can be read…",
                        async () =>
                        {
                            await writeFile(
                                fileName,
                                dedent(
                                    `
                                        // Hello world
                                        ${JSON.stringify(randomData)}`));

                            strictEqual(JSON.stringify(await workspaceProvider.ReadJSON(fileName)), JSON.stringify(randomData));
                        });
                });
        });
}
