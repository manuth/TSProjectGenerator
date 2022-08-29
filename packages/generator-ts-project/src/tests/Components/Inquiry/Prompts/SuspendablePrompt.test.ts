import { doesNotReject, strictEqual } from "assert";
import { EOL } from "os";
import inquirer, { PromptModule } from "inquirer";
import { SuspendablePrompt } from "../../../../Components/Inquiry/Prompts/SuspendablePrompt.js";
import { TestContext } from "../../../TestContext.js";

/**
 * Registers tests for the {@link SuspendablePrompt `SuspendablePrompt<T>`} class.
 */
export function SuspendablePromptTests(): void
{
    suite(
        nameof<SuspendablePrompt<any>>(),
        () =>
        {
            let type: undefined;
            let testKey = "test" as const;
            let testValue: string;
            let promptModule: PromptModule;

            suiteSetup(
                () =>
                {
                    type = "test" as undefined;
                });

            setup(
                () =>
                {
                    promptModule = inquirer.createPromptModule();
                    testValue = TestContext.Default.RandomString;
                });

            suite(
                "General",
                () =>
                {
                    test(
                        "Checking whether prompts can be suspended and resumed without an error…",
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);

                            promptModule.registerPrompt(
                                type,
                                class extends SuspendablePrompt<any>
                                {
                                    /**
                                     * @inheritdoc
                                     *
                                     * @returns
                                     * The result of the prompt.
                                     */
                                    protected async Run(): Promise<unknown>
                                    {
                                        await this.Suspend();

                                        let result = await TestContext.Default.MockPrompts(
                                            inquirer.createPromptModule(),
                                            [
                                                {
                                                    name: testKey,
                                                    message: "Specify random alphanumerical characters"
                                                }
                                            ],
                                            [
                                                [
                                                    testValue,
                                                    EOL
                                                ]
                                            ]);

                                        await this.Resume();
                                        return result[testKey];
                                    }
                                });

                            await doesNotReject(
                                async () =>
                                {
                                    await promptModule(
                                        [
                                            {
                                                type,
                                                name: testKey
                                            }
                                        ]);
                                });

                            strictEqual(
                                (
                                    await promptModule(
                                        [
                                            {
                                                type,
                                                name: testKey
                                            }
                                        ]))[testKey],
                                testValue);
                        });
                });
        });
}
