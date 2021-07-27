import { ok, strictEqual } from "assert";
import { createPromptModule, DistinctQuestion, PromptModule, Question } from "inquirer";
import { QuestionSetPrompt } from "../../../../Components/Inquiry/Prompts/QuestionSetPrompt";
import { TestContext } from "../../../TestContext";

/**
 * Registers tests for the {@link QuestionSetPrompt `QuestionSetPrompt<T>`} class.
 */
export function QuestionSetPromptTests(): void
{
    suite(
        nameof<QuestionSetPrompt<any>>(),
        () =>
        {
            let promptModule: PromptModule;
            let testKey = "test" as const;
            let name: string;
            let message: string;
            let questions: DistinctQuestion[];

            /**
             * Represents the answer-hash.
             */
            interface IAnswerHash
            {
                /**
                 * Provides properties for a question.
                 */
                [testKey]: Question;
            }

            /**
             * Provides an implementation of the {@link QuestionSetPrompt `QuestionSetPrompt<T>`} for testing.
             */
            class TestQuestionSetPrompt extends QuestionSetPrompt<any>
            {
                /**
                 * @inheritdoc
                 *
                 * @returns
                 * The result of the prompt.
                 */
                public override async Run(): Promise<unknown>
                {
                    return super.Run();
                }
            }

            setup(
                () =>
                {
                    promptModule = createPromptModule();
                    promptModule.registerPrompt(QuestionSetPrompt.TypeName, QuestionSetPrompt);
                    TestContext.Default.RegisterTestPrompt("input", promptModule);
                    name = TestContext.Default.RandomString;
                    message = TestContext.Default.RandomString;

                    questions = [
                        {
                            name: nameof<Question>((question) => question.name),
                            default: name
                        },
                        {
                            name: nameof<Question>((question) => question.message),
                            default: message
                        }
                    ];
                });

            suite(
                nameof<TestQuestionSetPrompt>((prompt) => prompt.Run),
                () =>
                {
                    test(
                        "Checking whether a set of multiple questions can be asked…",
                        async () =>
                        {
                            let result = await promptModule<IAnswerHash>(
                                [
                                    {
                                        type: QuestionSetPrompt.TypeName,
                                        name: testKey,
                                        promptTypes: promptModule.prompts,
                                        questions
                                    }
                                ]);

                            ok(typeof result[testKey] === "object");
                            strictEqual(result[testKey].name, name);
                            strictEqual(result[testKey].message, message);
                        });
                });
        });
}
