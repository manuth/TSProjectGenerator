import { deepStrictEqual, ok } from "assert";
import { FileMapping, GeneratorOptions, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { FileMappingTester, TestGenerator } from "@manuth/extended-yo-generator-test";
import { parse, stringify } from "comment-json";
import dedent from "dedent";
import upath from "upath";
import { WorkspaceFolderCreator } from "../../../VSCode/FileMappings/WorkspaceFolderCreator.js";
import { TestContext } from "../../TestContext.js";
import { TestCodeWorkspaceComponent } from "../Components/TestCodeWorkspaceComponent.js";
import { TestCodeWorkspaceProvider } from "./TestCodeWorkspaceProvider.js";

const { join } = upath;

/**
 * Registers tests for the {@link WorkspaceFolderCreator `WorkspaceFolderCreator<TSettings, TOptions>`} class.
 */
export function WorkspaceFolderCreatorTest(): void
{
    suite(
        nameof(WorkspaceFolderCreator),
        () =>
        {
            let context = TestContext.Default;
            let generator: TestGenerator;
            let randomComment: string;
            let component: TestCodeWorkspaceComponent<IGeneratorSettings, GeneratorOptions>;
            let source: TestCodeWorkspaceProvider<IGeneratorSettings, GeneratorOptions>;
            let fileMappingCreator: WorkspaceFolderCreator<IGeneratorSettings, GeneratorOptions>;

            /**
             * Asserts the content of the file located at the specified {@link path `path`}.
             *
             * @param path
             * The path whose contents to assert.
             *
             * @param expected
             * The expected content.
             */
            async function AssertContent(path: string, expected: any): Promise<void>
            {
                let fileMapping = new FileMapping(
                    generator,
                    {
                        Destination: path
                    });

                deepStrictEqual(
                    await source.ReadJSON(fileMapping.Destination),
                    await expected);
            }

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    generator = await context.Generator;
                    component = new TestCodeWorkspaceComponent(generator);
                    source = new TestCodeWorkspaceProvider(component);
                    component.Source = source;
                    fileMappingCreator = new WorkspaceFolderCreator(component);
                    component.FileMappingCreator = fileMappingCreator;
                });

            setup(
                async function()
                {
                    this.timeout(10 * 1000);
                    let workspace = await source.GetWorkspaceMetadata();
                    randomComment = context.RandomString;
                    workspace.extensions = context.RandomObject;
                    workspace.launch = context.RandomObject;
                    workspace.settings = context.RandomObject;

                    workspace.tasks = parse(
                        dedent(
                            `
                                /* ${randomComment} */
                                ${stringify(context.RandomObject)}`)) as any;

                    for (let fileMappingOptions of component.FileMappings)
                    {
                        let tester = new FileMappingTester(generator, fileMappingOptions);
                        await tester.Run();
                    }
                });

            suite(
                nameof<WorkspaceFolderCreator<any, any>>((creator) => creator.FileMappings),
                () =>
                {
                    test(
                        "Checking whether the workspace-files are created correctly…",
                        async function()
                        {
                            this.timeout(1 * 1000);
                            this.slow(0.5 * 1000);

                            let fileAssertions: Array<[string, Promise<any>]> = [
                                [fileMappingCreator.ExtensionsFileName, component.Source.GetExtensionsMetadata()],
                                [fileMappingCreator.LaunchFileName, component.Source.GetLaunchMetadata()],
                                [fileMappingCreator.SettingsFileName, component.Source.GetSettingsMetadata()],
                                [fileMappingCreator.TasksFileName, component.Source.GetTasksMetadata()]
                            ];

                            for (let fileAssertion of fileAssertions)
                            {
                                let path = join(fileMappingCreator.SettingsFolderName, fileAssertion[0]);
                                await AssertContent(path, await fileAssertion[1]);
                            }
                        });

                    test(
                        "Checking whether comments persist in the workspace-files…",
                        async () =>
                        {
                            ok(
                                stringify(
                                    await source.ReadJSON(
                                        new FileMapping(
                                            generator,
                                            {
                                                Destination: join(
                                                    fileMappingCreator.SettingsFolderName,
                                                    fileMappingCreator.TasksFileName)
                                            }).Destination),
                                    null,
                                    4).includes(randomComment));
                        });
                });
        });
}
