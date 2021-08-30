import { ok, strictEqual } from "assert";
import { EOL } from "os";
import { createPromptModule, prompt, PromptModule, QuestionTypeName } from "inquirer";
import { MockSTDIN, stdin } from "mock-stdin";
import { Random } from "random-js";
import { stub } from "sinon";
import { TestPrompt } from "../Inquiry/TestPrompt";
import { TestContext } from "../TestContext";

/**
 * Registers tests for the {@link TestContext `TestContext`} class.
 */
export function TestContextTests(): void
{
    suite(
        nameof(TestContext),
        () =>
        {
            let random: Random;
            let context: TestContext;
            let promptModule: PromptModule;
            let defaultTypeName: QuestionTypeName;
            let firstQuestionName: string;
            let secondQuestionName: string;
            let firstAnswer: string;
            let secondAnswer: string;

            suiteSetup(
                () =>
                {
                    random = new Random();
                    context = new TestContext();
                    promptModule = createPromptModule();
                    defaultTypeName = "input";
                    firstQuestionName = "first";
                    secondQuestionName = "second";
                    firstAnswer = random.string(10);
                    secondAnswer = random.string(11);
                });

            setup(
                () =>
                {
                    prompt.restoreDefaultPrompts();
                    promptModule.restoreDefaultPrompts();
                });

            suite(
                nameof<TestContext>((context) => context.MockPrompts),
                () =>
                {
                    test(
                        "Checking whether prompts can be mocked…",
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);

                            let result = await context.MockPrompts(
                                promptModule,
                                [
                                    {
                                        name: firstQuestionName
                                    },
                                    {
                                        name: secondQuestionName
                                    }
                                ],
                                [
                                    [
                                        firstAnswer,
                                        EOL
                                    ],
                                    [
                                        secondAnswer,
                                        EOL
                                    ]
                                ]);

                            strictEqual(result[firstQuestionName], firstAnswer);
                            strictEqual(result[secondQuestionName], secondAnswer);
                        });

                    test(
                        "Checking whether mocks can define pre-processors and post-processors…",
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);
                            let key = random.string(4);
                            let value = random.string(20);
                            let preprocessor = stub();
                            let callback = stub();

                            await context.MockPrompts(
                                promptModule,
                                [
                                    {
                                        name: firstQuestionName
                                    }
                                ],
                                [
                                    {
                                        preprocess: (stdin) =>
                                        {
                                            preprocessor();
                                            (stdin as any)[key] = value;
                                        },
                                        input: [
                                            firstAnswer,
                                            EOL
                                        ],
                                        callback: (stdin) =>
                                        {
                                            strictEqual((stdin as any)[key], value);
                                            callback();
                                        }
                                    }
                                ]);

                            ok(preprocessor.calledOnce);
                            ok(callback.calledOnce);
                        });

                    test(
                        `Checking whether a \`${nameof<MockSTDIN>()}\`-instance can be passed to the method…`,
                        async () =>
                        {
                            let mockedStdin = stdin();

                            try
                            {
                                let result = await context.MockPrompts(
                                    promptModule,
                                    [
                                        {
                                            name: firstQuestionName
                                        }
                                    ],
                                    [
                                        [
                                            firstAnswer,
                                            EOL
                                        ]
                                    ],
                                    mockedStdin);

                                strictEqual(result[firstQuestionName], firstAnswer);
                                strictEqual(process.stdin, mockedStdin);
                            }
                            catch (exception)
                            {
                                throw exception;
                            }
                            finally
                            {
                                mockedStdin.end();
                            }
                        });
                });

            suite(
                nameof<TestContext>((context) => context.RegisterTestPrompt),
                () =>
                {
                    test(
                        `Checking whether the \`${nameof(TestPrompt)}\` can be registered…`,
                        () =>
                        {
                            let type: QuestionTypeName = "input";
                            context.RegisterTestPrompt(promptModule, type);
                            strictEqual(promptModule.prompts[type], TestPrompt);
                        });

                    test(
                        `Checking whether the \`${nameof(TestPrompt)}\`-prompt is registered to the \`${defaultTypeName}\`-type by default…`,
                        () =>
                        {
                            context.RegisterTestPrompt(prompt);
                            strictEqual(prompt.prompts[defaultTypeName], TestPrompt);
                        });
                });
        });
}
