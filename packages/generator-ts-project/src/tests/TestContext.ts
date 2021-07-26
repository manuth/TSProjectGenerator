import { Generator } from "@manuth/extended-yo-generator";
import { ITestGeneratorOptions, ITestOptions, TestContext as GeneratorContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { DistinctQuestion, PromptModule } from "inquirer";
import { MockSTDIN, stdin } from "mock-stdin";
import { CodeWorkspaceComponent } from "../VSCode/Components/CodeWorkspaceComponent";
import { TasksProcessor } from "../VSCode/TasksProcessor";
import { IMockedAnswer } from "./IMockedAnswer";

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
    public async MockPrompts(promptModule: PromptModule, questions: DistinctQuestion[], answers: Array<string[] | IMockedAnswer>, mockedStdin?: MockSTDIN): Promise<unknown>
    {
        let generatedMock = null;

        if (!mockedStdin)
        {
            generatedMock = stdin();
            mockedStdin = generatedMock;
        }

        /**
         * Sends the specified {@link input `input`} to the {@link process.stdin `process.stdin`}.
         *
         * @param input
         * The input to send to the {@link process.stdin `process.stdin`}.
         */
        function SendInput(input: string[]): void
        {
            for (let line of input)
            {
                mockedStdin.send(line);
            }
        }

        /**
         * Processes the specified {@link mockedAnswer `mockedAnswer`}.
         *
         * @param mockedAnswer
         * The mocked answer to process.
         */
        function ProcessMockedAnswer(mockedAnswer: IMockedAnswer | string[]): void
        {
            let answer: IMockedAnswer;

            if (Array.isArray(mockedAnswer))
            {
                answer = {
                    input: mockedAnswer
                };
            }
            else
            {
                answer = mockedAnswer;
            }

            process.nextTick(
                () =>
                {
                    answer?.preprocess?.(mockedStdin);
                    SendInput(answer?.input ?? []);
                    answer?.callback?.(mockedStdin);
                });
        }

        try
        {
            let index = 0;
            let result = promptModule(questions);
            ProcessMockedAnswer(answers[index++]);

            result.ui.process.subscribe(
                {
                    next: (answerHash) =>
                    {
                        ProcessMockedAnswer(answers[index++]);
                    }
                });

            await result;
            return result;
        }
        catch (exception)
        {
            throw exception;
        }
        finally
        {
            generatedMock?.restore();
        }
    }
}
