import Assert = require("assert");
import { IFileMapping } from "@manuth/extended-yo-generator";
import { TestContext, TestGenerator, ITestGeneratorSettings } from "@manuth/extended-yo-generator-test";
import dedent = require("dedent");
import { writeFile, remove, pathExists } from "fs-extra";
import { Random } from "random-js";
import { TempDirectory } from "temp-filesystem";
import { CodeWorkspaceComponent } from "../../../VSCode/Components/CodeWorkspaceComponent";
import { IExtensionFile } from "../../../VSCode/IExtensionFile";
import { ILaunchFile } from "../../../VSCode/ILaunchFile";
import { ITaskFile } from "../../../VSCode/ITaskFile";
import { FileMappingTester } from "../../Components/FileMappingTester";
import { TestCodeWorkspaceProvider } from "./TestCodeWorkspaceProvider";

/**
 * Registers tests for the `CodeWorkspaceProvider` class.
 *
 * @param context
 * The test-context.
 */
export function CodeWorkspaceProviderTests(context: TestContext<TestGenerator>): void
{
    suite(
        "CodeWorkspaceProvider",
        () =>
        {
            let random: Random;
            let tempDir: TempDirectory;
            let fileName: string;
            let generator: TestGenerator;
            let fileMappingTester: FileMappingTester<TestGenerator, ITestGeneratorSettings, IFileMapping<ITestGeneratorSettings>>;
            let workspaceProvider: TestCodeWorkspaceProvider<ITestGeneratorSettings>;

            /**
             * Generates random data.
             *
             * @returns
             * Random data.
             */
            function RandomData(): any
            {
                return {
                    random: random.string(10)
                };
            }

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    random = new Random();
                    tempDir = new TempDirectory();
                    fileName = tempDir.MakePath("temp.txt");
                    generator = await context.Generator;
                    fileMappingTester = new FileMappingTester(generator, { Destination: fileName });
                    workspaceProvider = new TestCodeWorkspaceProvider(new CodeWorkspaceComponent(generator));
                });

            suiteTeardown(
                () =>
                {
                    tempDir.Dispose();
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
                    let randomExtensions: IExtensionFile;
                    let randomLaunchData: ILaunchFile;
                    let randomSettings: Record<string, any>;
                    let randomTasks: ITaskFile;

                    setup(
                        () =>
                        {
                            randomExtensions = RandomData();
                            randomLaunchData = RandomData();
                            randomSettings = RandomData();
                            randomTasks = RandomData();
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

                            Assert.strictEqual(await workspaceProvider.ExtensionsMetadata, randomExtensions);
                            Assert.strictEqual(await workspaceProvider.LaunchMetadata, randomLaunchData);
                            Assert.strictEqual(await workspaceProvider.SettingsMetadata, randomSettings);
                            Assert.strictEqual(await workspaceProvider.TasksMetadata, randomTasks);
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
                            randomData = {
                                random: random.string(20)
                            };
                        });

                    test(
                        "Checking whether files can be read from the file-system…",
                        async () =>
                        {
                            await writeFile(fileName, JSON.stringify(randomData));
                            await fileMappingTester.Commit();
                            generator.fs.exists(fileName);
                            Assert.deepStrictEqual(await workspaceProvider.ReadJSON(fileName), randomData);
                        });

                    test(
                        "Checking whether files can be read from the `mem-fs`…",
                        async () =>
                        {
                            generator.fs.writeJSON(fileName, randomData);
                            Assert.deepStrictEqual(await workspaceProvider.ReadJSON(fileName), randomData);
                        });

                    test(
                        "Checking whether files containing comments can be read…",
                        async () =>
                        {
                            generator.fs.write(
                                fileName,
                                dedent(
                                    `
                                        // Hello world
                                        ${JSON.stringify(randomData)}`));

                            Assert.strictEqual(JSON.stringify(await workspaceProvider.ReadJSON(fileName)), JSON.stringify(randomData));
                        });
                });
        });
}
