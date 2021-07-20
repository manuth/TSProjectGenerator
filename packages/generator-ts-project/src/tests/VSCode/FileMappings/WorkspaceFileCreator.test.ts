import { deepStrictEqual, ok } from "assert";
import { GeneratorOptions, IFileMapping } from "@manuth/extended-yo-generator";
import { FileMappingTester, ITestGeneratorOptions, ITestGeneratorSettings, ITestOptions, TestGenerator } from "@manuth/extended-yo-generator-test";
import { JSONCFileMappingTester } from "@manuth/generator-ts-project-test";
import { assign, parse, stringify } from "comment-json";
import dedent = require("dedent");
import { WorkspaceFileCreator } from "../../../VSCode/FileMappings/WorkspaceFileCreator";
import { IWorkspaceMetadata } from "../../../VSCode/IWorkspaceMetadata";
import { TestContext } from "../../TestContext";
import { TestCodeWorkspaceComponent } from "../Components/TestCodeWorkspaceComponent";
import { TestCodeWorkspaceProvider } from "./TestCodeWorkspaceProvider";

/**
 * Registers tests for the {@link WorkspaceFileCreator `WorkspaceFileCreator<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function WorkspaceFileCreatorTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        nameof(WorkspaceFileCreator),
        () =>
        {
            let generator: TestGenerator;
            let fileName: string;
            let workspace: IWorkspaceMetadata;
            let tasksComment: string;
            let rootComment: string;
            let tester: JSONCFileMappingTester<TestGenerator, ITestGeneratorSettings, GeneratorOptions, IFileMapping<ITestGeneratorSettings, GeneratorOptions>, IWorkspaceMetadata>;
            let component: TestCodeWorkspaceComponent<ITestGeneratorSettings, GeneratorOptions>;
            let source: TestCodeWorkspaceProvider<ITestGeneratorSettings, GeneratorOptions>;
            let fileMappingCreator: WorkspaceFileCreator<ITestGeneratorSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    generator = await context.Generator;
                    fileName = "test.code-workspace";
                    component = new TestCodeWorkspaceComponent(generator);
                    source = new TestCodeWorkspaceProvider(component);
                    component.Source = source;
                    fileMappingCreator = new WorkspaceFileCreator(component, fileName);
                    component.FileMappingCreator = fileMappingCreator;
                    tester = new JSONCFileMappingTester(generator, { Destination: fileName });
                });

            setup(
                async function()
                {
                    this.timeout(10 * 1000);
                    workspace = await source.GetWorkspaceMetadata();
                    tasksComment = context.RandomString + "-comment";
                    rootComment = context.RandomString + "-comment-2";
                    workspace.extensions = context.RandomObject;
                    workspace.launch = context.RandomObject;
                    workspace.settings = context.RandomObject;

                    workspace.tasks = parse(
                        dedent(
                            `
                                {
                                    /* ${tasksComment} */
                                    "random": ${stringify(context.RandomObject)}
                                }`));

                    assign(
                        workspace,
                        parse(
                            dedent(
                                `
                                    /* ${rootComment} */
                                    ${stringify(workspace, null, 4)}`)));

                    for (let fileMappingOptions of component.FileMappings)
                    {
                        let tester = new FileMappingTester(generator, fileMappingOptions);
                        await tester.Run();
                    }
                });

            suite(
                nameof<WorkspaceFileCreator<any, any>>((creator) => creator.FileMappings),
                () =>
                {
                    test(
                        "Checking whether the metadata of the workspace-file is created correctly…",
                        async () =>
                        {
                            deepStrictEqual(await tester.ParseOutput(), parse(stringify(workspace)));
                        });

                    test(
                        "Checking whether comments inside nested objects persist…",
                        async () =>
                        {
                            ok(
                                stringify(
                                    (await tester.ParseOutput()).tasks,
                                    null,
                                    4).includes(tasksComment));
                        });

                    test(
                        "Checking whether root comments persist…",
                        async () =>
                        {
                            ok((await tester.Content).includes(rootComment));
                        });
                });
        });
}
