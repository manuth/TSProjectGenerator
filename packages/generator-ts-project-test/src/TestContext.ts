import { DistinctQuestion, Inquirer, PromptModule, QuestionTypeName } from "inquirer";
import { MockSTDIN, stdin } from "mock-stdin";
import { IMockedAnswer } from "./Inquiry/IMockedAnswer";
import { TestPrompt } from "./Inquiry/TestPrompt";

/**
 * Represents a context for testing.
 */
export class TestContext
{
    /**
     * Initializes a new instance of the {@link TestContext `TestContext`} class.
     */
    public constructor()
    { }

    /**
     * @inheritdoc
     */
    public static get Default(): TestContext
    {
        return new TestContext();
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
        promptModule.registerPrompt(type, TestPrompt);
    }
}
