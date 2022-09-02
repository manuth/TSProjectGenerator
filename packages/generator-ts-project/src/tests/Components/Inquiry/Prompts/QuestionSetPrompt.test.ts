import { ok, strictEqual } from "node:assert";
import { TestGenerator } from "@manuth/extended-yo-generator-test";
import inquirer, { Answers, DistinctQuestion, PromptModule, Question } from "inquirer";
import { QuestionSetPrompt } from "../../../../Components/Inquiry/Prompts/QuestionSetPrompt.js";
import { TestContext } from "../../../TestContext.js";

/**
 * Registers tests for the {@link QuestionSetPrompt `QuestionSetPrompt<T>`} class.
 */
export function QuestionSetPromptTests(): void
{
    suite(
        nameof<QuestionSetPrompt<any>>(),
        () =>
        {
            let context: TestContext<TestGenerator>;
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

            suiteSetup(
                () =>
                {
                    context = TestContext.Default;
                });

            setup(
                () =>
                {
                    promptModule = inquirer.createPromptModule();
                    promptModule.registerPrompt(QuestionSetPrompt.TypeName, QuestionSetPrompt);
                    context.RegisterTestPrompt(promptModule, "input");
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

                    test(
                        "Checking whether all answers are passed to the question-properties…",
                        async () =>
                        {
                            let value = context.RandomString;
                            let key = `${testKey}2`;
                            let testValue: string;

                            let result = await promptModule<IAnswerHash>(
                                [
                                    {
                                        name: key,
                                        default: value
                                    },
                                    {
                                        type: QuestionSetPrompt.TypeName,
                                        name: testKey,
                                        promptTypes: promptModule.prompts,
                                        questions: [
                                            {
                                                ...questions[0],
                                                default: (result: Answers, answers: IAnswerHash) =>
                                                {
                                                    testValue = (answers as any)[key];
                                                    return testValue;
                                                }
                                            },
                                            ...questions.slice(1)
                                        ]
                                    }
                                ]);

                            strictEqual(testValue, value);
                            strictEqual(result[testKey].name, value);
                        });
                });
        });
}
