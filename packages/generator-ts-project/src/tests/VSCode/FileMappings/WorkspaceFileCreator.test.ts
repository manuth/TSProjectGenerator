import { deepStrictEqual, ok } from "assert";
import { GeneratorOptions, IFileMapping, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { FileMappingTester, TestGenerator } from "@manuth/extended-yo-generator-test";
import { JSONCFileMappingTester } from "@manuth/generator-ts-project-test";
import { assign, parse, stringify } from "comment-json";
import dedent from "dedent";
import { WorkspaceFileCreator } from "../../../VSCode/FileMappings/WorkspaceFileCreator.js";
import { IWorkspaceMetadata } from "../../../VSCode/IWorkspaceMetadata.js";
import { TestContext } from "../../TestContext.js";
import { TestCodeWorkspaceComponent } from "../Components/TestCodeWorkspaceComponent.js";
import { TestCodeWorkspaceProvider } from "./TestCodeWorkspaceProvider.js";

/**
 * Registers tests for the {@link WorkspaceFileCreator `WorkspaceFileCreator<TSettings, TOptions>`} class.
 */
export function WorkspaceFileCreatorTests(): void
{
    suite(
        nameof(WorkspaceFileCreator),
        () =>
        {
            let context = TestContext.Default;
            let generator: TestGenerator;
            let fileName: string;
            let workspace: IWorkspaceMetadata;
            let tasksComment: string;
            let rootComment: string;
            let tester: JSONCFileMappingTester<TestGenerator, IGeneratorSettings, GeneratorOptions, IFileMapping<IGeneratorSettings, GeneratorOptions>, IWorkspaceMetadata>;
            let component: TestCodeWorkspaceComponent<IGeneratorSettings, GeneratorOptions>;
            let source: TestCodeWorkspaceProvider<IGeneratorSettings, GeneratorOptions>;
            let fileMappingCreator: WorkspaceFileCreator<IGeneratorSettings, GeneratorOptions>;

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
                                }`)) as any;

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
                            ok((await tester.ReadOutput()).includes(rootComment));
                        });
                });
        });
}
