import { deepStrictEqual, strictEqual } from "assert";
import { GeneratorOptions, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { TestGenerator } from "@manuth/extended-yo-generator-test";
import { TempDirectory } from "@manuth/temp-files";
import dedent = require("dedent");
import { pathExists, remove, writeFile } from "fs-extra";
import { CodeWorkspaceComponent } from "../../../VSCode/Components/CodeWorkspaceComponent";
import type { CodeWorkspaceProvider } from "../../../VSCode/FileMappings/CodeWorkspaceProvider";
import { IExtensionSettings } from "../../../VSCode/IExtensionSettings";
import { ILaunchSettings } from "../../../VSCode/ILaunchSettings";
import { ITaskSettings } from "../../../VSCode/ITaskSettings";
import { TestContext } from "../../TestContext";
import { TestCodeWorkspaceProvider } from "./TestCodeWorkspaceProvider";

/**
 * Registers tests for the {@link CodeWorkspaceProvider `CodeWorkspaceProvider<TSettings, TOptions>`} class.
 */
export function CodeWorkspaceProviderTests(): void
{
    suite(
        nameof<CodeWorkspaceProvider<any, any>>(),
        () =>
        {
            let context = TestContext.Default;
            let tempDir: TempDirectory;
            let fileName: string;
            let generator: TestGenerator;
            let workspaceProvider: TestCodeWorkspaceProvider<IGeneratorSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    tempDir = new TempDirectory();
                    fileName = tempDir.MakePath("temp.txt");
                    generator = await context.Generator;
                    workspaceProvider = new TestCodeWorkspaceProvider(new CodeWorkspaceComponent(generator));
                });

            teardown(
                async () =>
                {
                    if (await pathExists(fileName))
                    {
                        return remove(fileName);
                    }
                });

            suite(
                nameof<CodeWorkspaceProvider<any, any>>((provider) => provider.GetWorkspaceMetadata),
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
                        `Checking whether the metadata of all components are loaded using \`${nameof<CodeWorkspaceProvider<any, any>>((p) => p.GetWorkspaceMetadata)}\`…`,
                        async () =>
                        {
                            workspaceProvider.WorkspaceMetadata = {
                                folders: [],
                                extensions: randomExtensions,
                                launch: randomLaunchData,
                                settings: randomSettings,
                                tasks: randomTasks
                            };

                            strictEqual(await workspaceProvider.GetExtensionsMetadata(), randomExtensions);
                            strictEqual(await workspaceProvider.GetLaunchMetadata(), randomLaunchData);
                            strictEqual(await workspaceProvider.GetSettingsMetadata(), randomSettings);
                            strictEqual(await workspaceProvider.GetTasksMetadata(), randomTasks);
                        });
                });

            suite(
                nameof<TestCodeWorkspaceProvider<any, any>>((provider) => provider.ReadJSON),
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
