import Assert = require("assert");
import { FileMapping } from "@manuth/extended-yo-generator";
import { TestContext, TestGenerator, ITestGeneratorSettings } from "@manuth/extended-yo-generator-test";
import JSON = require("comment-json");
import dedent = require("dedent");
import { Random } from "random-js";
import { join } from "upath";
import { WorkspaceFolderCreator } from "../../../VSCode/FileMappings/WorkspaceFolderCreator";
import { FileMappingTester } from "../../Components/FileMappingTester";
import { TestCodeWorkspaceComponent } from "../Components/TestCodeWorkspaceComponent";
import { TestCodeWorkspaceProvider } from "./TestCodeWorkspaceProvider";

/**
 * Registers tests for the `WorkspaceFolderCreator` class.
 *
 * @param context
 * The test-context.
 */
export function WorkspaceFolderCreatorTest(context: TestContext<TestGenerator>): void
{
    suite(
        "WorkspaceFolderCreator",
        () =>
        {
            let random: Random;
            let generator: TestGenerator;
            let randomComment: string;
            let component: TestCodeWorkspaceComponent<ITestGeneratorSettings>;
            let source: TestCodeWorkspaceProvider<ITestGeneratorSettings>;
            let fileMappingCreator: WorkspaceFolderCreator<ITestGeneratorSettings>;

            /**
             * Generates a random object.
             *
             * @returns
             * A random object.
             */
            function RandomData(): any
            {
                return {
                    random: random.string(10)
                };
            }

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
                    random = new Random();
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
                    randomComment = random.string(10);
                    workspace.extensions = RandomData();
                    workspace.launch = RandomData();
                    workspace.settings = RandomData();

                    workspace.tasks = JSON.parse(
                        dedent(
                            `
                                /* ${randomComment} */
                                ${JSON.stringify(RandomData())}`));

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
