import { deepStrictEqual, ok } from "assert";
import { FileMapping, GeneratorOptions } from "@manuth/extended-yo-generator";
import { FileMappingTester, ITestGeneratorOptions, ITestGeneratorSettings, ITestOptions, TestGenerator } from "@manuth/extended-yo-generator-test";
import { parse, stringify } from "comment-json";
import dedent = require("dedent");
import { join } from "upath";
import { WorkspaceFolderCreator } from "../../../VSCode/FileMappings/WorkspaceFolderCreator";
import { TestContext } from "../../TestContext";
import { TestCodeWorkspaceComponent } from "../Components/TestCodeWorkspaceComponent";
import { TestCodeWorkspaceProvider } from "./TestCodeWorkspaceProvider";

/**
 * Registers tests for the {@link WorkspaceFolderCreator `WorkspaceFolderCreator<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function WorkspaceFolderCreatorTest(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "WorkspaceFolderCreator",
        () =>
        {
            let generator: TestGenerator;
            let randomComment: string;
            let component: TestCodeWorkspaceComponent<ITestGeneratorSettings, GeneratorOptions>;
            let source: TestCodeWorkspaceProvider<ITestGeneratorSettings, GeneratorOptions>;
            let fileMappingCreator: WorkspaceFolderCreator<ITestGeneratorSettings, GeneratorOptions>;

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
                    let workspace = await source.WorkspaceMetadata;
                    randomComment = context.RandomString;
                    workspace.extensions = context.RandomObject;
                    workspace.launch = context.RandomObject;
                    workspace.settings = context.RandomObject;

                    workspace.tasks = parse(
                        dedent(
                            `
                                /* ${randomComment} */
                                ${stringify(context.RandomObject)}`));

                    for (let fileMappingOptions of component.FileMappings)
                    {
                        let tester = new FileMappingTester(generator, fileMappingOptions);
                        await tester.Run();
                    }
                });

            test(
                "Checking whether the workspace-files are created correctly…",
                async function()
                {
                    this.timeout(1 * 1000);
                    this.slow(0.5 * 1000);

                    let fileAssertions: Array<[string, Promise<any>]> = [
                        [fileMappingCreator.ExtensionsFileName, component.Source.ExtensionsMetadata],
                        [fileMappingCreator.LaunchFileName, component.Source.LaunchMetadata],
                        [fileMappingCreator.SettingsFileName, component.Source.SettingsMetadata],
                        [fileMappingCreator.TasksFileName, component.Source.TasksMetadata]
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
}
