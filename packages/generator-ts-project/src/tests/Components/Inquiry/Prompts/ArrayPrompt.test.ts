import { ok, strictEqual } from "node:assert";
import { createRequire } from "node:module";
import inquirer, { DistinctQuestion } from "inquirer";
import mock from "mock-require";
import { ArrayPrompt } from "../../../../Components/Inquiry/Prompts/ArrayPrompt.js";
import { IArrayPromptHash } from "../../../../Components/Inquiry/Prompts/IArrayPromptHash.js";
import { IArrayQuestionOptions } from "../../../../Components/Inquiry/Prompts/IArrayQuestionOptions.js";
import { TestContext } from "../../../TestContext.js";

/**
 * Registers tests for the {@link ArrayPrompt `ArrayPrompt<TQuestion, TItem>`}
 */
export function ArrayPromptTests(): void
{
    suite(
        nameof(ArrayPrompt),
        () =>
        {
            let inquirerModuleName = "inquirer";
            let context = TestContext.Default;
            let repeat: (answers: any) => boolean;
            let type = "test" as undefined;
            let testLength: number;
            let testValue: string;
            let questions: DistinctQuestion[];
            let testKey = "test" as const;

            /**
             * Provides an implementation of the {@link ArrayPrompt `ArrayPrompt<TQuestion, TItem>`} class for testing.
             */
            class TestArrayPrompt extends ArrayPrompt<any, string>
            {
                /**
                 * @inheritdoc
                 *
                 * @returns
                 * The result of the prompt.
                 */
                public override Run(): Promise<string[]>
                {
                    return super.Run();
                }

                /**
                 * @inheritdoc
                 *
                 * @param items
                 * The items that have been collected yet.
                 *
                 * @returns
                 * The item to add.
                 */
                public async PromptItem(items: readonly string[]): Promise<string>
                {
                    return testValue;
                }

                /**
                 * @inheritdoc
                 *
                 * @param items
                 * The currently stored items.
                 *
                 * @returns
                 * An answer-hash containing a value indicating whether another item should be added.
                 */
                public override async PromptAdd(items: readonly string[]): Promise<IArrayPromptHash>
                {
                    return super.PromptAdd(items);
                }
            }

            setup(
                () =>
                {
                    let i = 0;
                    testLength = 1;
                    testValue = context.RandomObject;
                    context.RegisterTestPrompt(inquirer.prompt, "confirm");
                    mock(inquirerModuleName, createRequire(import.meta.url).resolve(inquirerModuleName));
                    inquirer.registerPrompt(type, TestArrayPrompt);
                    repeat = () => ++i < testLength;

                    questions = [
                        {
                            type,
                            defaultRepeat: (answers) => repeat(answers),
                            name: testKey
                        }
                    ];
                });

            teardown(
                () =>
                {
                    inquirer.restoreDefaultPrompts();
                    mock.stop(inquirerModuleName);
                });

            suite(
                nameof<TestArrayPrompt>((prompt) => prompt.Run),
                () =>
                {
                    test(
                        `Checking whether the result of the \`${nameof(ArrayPrompt)}\` is an array…`,
                        async function()
                        {
                            this.timeout(2 * 1000);
                            this.slow(1 * 1000);
                            let result = await inquirer.prompt(questions);
                            let value = result[testKey];
                            ok(Array.isArray(value));

                            ok(
                                value.every(
                                    (entry) =>
                                    {
                                        return entry === testValue;
                                    }));
                        });

                    test(
                        "Checking whether additional items can be added to the array…",
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);
                            testLength = context.Random.integer(2, 10);
                            let value = (await inquirer.prompt(questions))[testKey];
                            ok(Array.isArray(value));
                            strictEqual(value.length, testLength);

                            ok(
                                value.every(
                                    (entry) =>
                                    {
                                        return entry === testValue;
                                    }));
                        });
                });

            suite(
                nameof<TestArrayPrompt>((prompt) => prompt.PromptAdd),
                () =>
                {
                    test(
                        `Checking whether the answer-hash with the current array is passed to the \`${nameof<IArrayQuestionOptions>((o) => o.defaultRepeat)}\`-option…`,
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);
                            let length = context.Random.integer(11, 15);

                            repeat = (answers) =>
                            {
                                return (answers[testKey] as string[]).length < length;
                            };

                            let result = await inquirer.prompt(questions);
                            strictEqual((result[testKey] as string[]).length, length);
                        });
                });
        });
}
