import { Generator } from "@manuth/extended-yo-generator";
import { IRunContext, ITestGeneratorOptions, ITestOptions, TestContext as GeneratorContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { IMockedAnswer, TestContext as ProjectContext } from "@manuth/generator-ts-project-test";
import { pathExists } from "fs-extra";
import { DistinctQuestion, Inquirer, PromptModule, QuestionTypeName } from "inquirer";
import { MockSTDIN } from "mock-stdin";
import { RunContextSettings } from "yeoman-test";
import { CodeWorkspaceComponent } from "../VSCode/Components/CodeWorkspaceComponent";
import { TasksProcessor } from "../VSCode/TasksProcessor";

/**
 * Represents a context for testing.
 *
 * @template TGenerator
 * The type of the generator to test.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class TestContext<TGenerator extends Generator<any, TOptions>, TOptions extends Record<string, any> = Record<string, any>> extends GeneratorContext<TGenerator, TOptions>
{
    /**
     * A context for testing project-generators.
     */
    private projectTestContext: ProjectContext = null;

    /**
     * A context for testing generators.
     */
    private generatorContext: GeneratorContext<TGenerator, TOptions>;

    /**
     * A component for processing tasks.
     */
    private tasksProcessor: TasksProcessor<any, any> = null;

    /**
     * Initializes a new instance of the {@link TestContext `TestContext<TGenerator, TOptions>`} class.
     *
     * @param generatorContext
     * A context for testing generators.
     */
    public constructor(generatorContext: GeneratorContext<TGenerator, TOptions>)
    {
        super(generatorContext.GeneratorDirectory);
        this.generatorContext = generatorContext;
    }

    /**
     * @inheritdoc
     */
    public static override get Default(): TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>
    {
        return new TestContext(GeneratorContext.Default);
    }

    /**
     * Gets a context for testing generators.
     */
    public get GeneratorContext(): GeneratorContext<TGenerator, TOptions>
    {
        return this.generatorContext;
    }

    /**
     * @inheritdoc
     */
    public override get Generator(): Promise<TGenerator>
    {
        return this.GeneratorContext.Generator;
    }

    /**
     * Gets a workspace-folder directive.
     */
    public get WorkspaceFolderDirective(): string
    {
        return this.GetWorkspaceFolderDirective();
    }

    /**
     * Gets a named workspace-folder directive.
     */
    public get NamedWorkspaceFolderDirective(): string
    {
        return this.GetWorkspaceFolderDirective("Test");
    }

    /**
     * Gets an argument indicating whether a managed version of the nested prompt should be tested.
     */
    public get ManagedArgument(): string
    {
        return "managed";
    }

    /**
     * Gets a component for processing tasks.
     */
    protected get TasksProcessor(): TasksProcessor<any, any>
    {
        if (this.tasksProcessor === null)
        {
            this.tasksProcessor = new TasksProcessor(new CodeWorkspaceComponent(this.CreateGenerator(TestGenerator)));
        }

        return this.tasksProcessor;
    }

    /**
     * Gets a context for testing project-generators.
     */
    protected get ProjectContext(): ProjectContext
    {
        if (this.projectTestContext === null)
        {
            this.projectTestContext = new ProjectContext();
        }

        return this.projectTestContext;
    }

    /**
     * Creates a workspace-folder directive.
     *
     * @param name
     * The name of the workspace-folder.
     *
     * @returns
     * A normal workspace-folder directive or a named workspace-folder directive if a {@link name `name`} is passed.
     */
    public GetWorkspaceFolderDirective(name?: string): string
    {
        return this.TasksProcessor.GetWorkspaceFolderDirective(name);
    }

    /**
     * Prompts the specified {@link questions `questions`} and mocks the specified {@link answers `answers`} to the {@link process.stdin `process.stdin`}.
     *
     * @param promptModule
     * The component for prompting the questions.
     *
     * @param questions
     * The questions to prompt.
     *
     * @param answers
     * The answers to mock.
     *
     * @param mockedStdin
     * The {@link MockSTDIN `MockSTDIN`}-instance to use.
     *
     * @returns
     * The result of the prompts.
     */
    public async MockPrompts<T>(promptModule: PromptModule, questions: Array<DistinctQuestion<T>>, answers: Array<string[] | IMockedAnswer>, mockedStdin?: MockSTDIN): Promise<T>
    {
        return this.ProjectContext.MockPrompts(promptModule, questions, answers, mockedStdin);
    }

    /**
     * Registers the {@link TestPrompt `TestPrompt`}.
     *
     * @param promptModule
     * The prompt-module to register the {@link TestPrompt `TestPrompt`}.
     *
     * @param type
     * The name of the type to register the {@link TestPrompt `TestPrompt`}.
     */
    public RegisterTestPrompt(promptModule: PromptModule | Inquirer, type: QuestionTypeName = "input"): void
    {
        this.ProjectContext.RegisterTestPrompt(promptModule, type);
    }

    /**
     * Registers mocha tasks for restoring the working directory.
     */
    public RegisterWorkingDirRestorer(): void
    {
        this.ProjectContext.RegisterWorkingDirRestorer();
    }

    /**
     * Executes the generator.
     *
     * @param options
     * The options for the generator.
     *
     * @param runSettings
     * The settings for executing the generator.
     *
     * @returns
     * The execution-context of the generator.
     */
    public override ExecuteGenerator(options?: TOptions, runSettings?: RunContextSettings): IRunContext<TGenerator>
    {
        let cacheSnapshot: string[];
        let result = super.ExecuteGenerator(options, runSettings);

        result.on(
            "ready",
            () =>
            {
                cacheSnapshot = Object.keys(require.cache);
            });

        result.on(
            "end",
            () =>
            {
                for (let fileName of Object.keys(require.cache))
                {
                    if (!cacheSnapshot.includes(fileName))
                    {
                        delete require.cache[fileName];
                    }
                }
            });

        return result;
    }

    /**
     * Removes inexistent files from {@link require.cache `require.cache`}.
     */
    public async InvalidateRequireCache(): Promise<void>
    {
        for (let fileName of Object.keys(require.cache))
        {
            if (!await pathExists(fileName))
            {
                delete require.cache[fileName];
            }
        }
    }
}
