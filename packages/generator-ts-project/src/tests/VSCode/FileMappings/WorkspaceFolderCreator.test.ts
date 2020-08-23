import Assert = require("assert");
import { GeneratorOptions, FileMapping } from "@manuth/extended-yo-generator";
import { TestGenerator, ITestGeneratorSettings, ITestGeneratorOptions, ITestOptions, FileMappingTester } from "@manuth/extended-yo-generator-test";
import JSON = require("comment-json");
import dedent = require("dedent");
import { join } from "upath";
import { WorkspaceFolderCreator } from "../../../VSCode/FileMappings/WorkspaceFolderCreator";
import { TestContext } from "../../TestContext";
import { TestCodeWorkspaceComponent } from "../Components/TestCodeWorkspaceComponent";
import { TestCodeWorkspaceProvider } from "./TestCodeWorkspaceProvider";

/**
 * Registers tests for the `WorkspaceFolderCreator` class.
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
             * Asserts the content of the file located at the `path`.
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

                Assert.deepStrictEqual(
                    await source.ReadJSON(await fileMapping.Destination),
                    await expected);
            }

            suiteSetup(
                async function()
                {
                    this.timeout(0);
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
                    this.timeout(0);
                    let workspace = await source.WorkspaceMetadata;
                    randomComment = context.RandomString;
                    workspace.extensions = context.RandomObject;
                    workspace.launch = context.RandomObject;
                    workspace.settings = context.RandomObject;

                    workspace.tasks = JSON.parse(
                        dedent(
                            `
                                /* ${randomComment} */
                                ${JSON.stringify(context.RandomObject)}`));

                    for (let fileMappingOptions of await component.FileMappings)
                    {
                        let tester = new FileMappingTester(generator, fileMappingOptions);
                        await tester.Run();
                    }
                });

            test(
                "Checking whether the workspace-files are created correctly…",
                async () =>
                {
                    let fileAssertions: Array<[string, Promise<any>]> = [
                        [fileMappingCreator.ExtensionsFileName, component.Source.ExtensionsMetadata],
                        [fileMappingCreator.LaunchFileName, component.Source.LaunchMetadata],
                        [fileMappingCreator.SettingsFileName, component.Source.SettingsMetadata],
                        [fileMappingCreator.TasksFileName, component.Source.TasksMetadata]
                    ];

                    for (let fileAssertion of fileAssertions)
                    {
                        let path = join(await fileMappingCreator.SettingsFolderName, fileAssertion[0]);
                        await AssertContent(path, await fileAssertion[1]);
                    }
                });

            test(
                "Checking whether comments presist in the workspace-files…",
                async () =>
                {
                    Assert.ok(
                        JSON.stringify(
                            await source.ReadJSON(
                                await new FileMapping(
                                    generator,
                                    {
                                        Destination: join(
                                            await fileMappingCreator.SettingsFolderName,
                                            fileMappingCreator.TasksFileName)
                                    }).Destination),
                            null,
                            4).includes(randomComment));
                });
        });
}
