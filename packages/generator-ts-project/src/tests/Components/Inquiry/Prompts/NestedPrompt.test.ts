import { ok, strictEqual } from "assert";
import { ChildProcess, fork } from "child_process";
import Prompt = require("inquirer/lib/prompts/base");
import { NestedPrompt } from "../../../../Components/Inquiry/Prompts/NestedPrompt";
import { TestContext } from "../../../TestContext";

/**
 * Registers tests for the {@link NestedPrompt `NestedPrompt`} class.
 */
export function NestedPromptTests(): void
{
    suite(
        nameof<NestedPrompt<any>>(),
        () =>
        {
            /**
             * Provides an implementation of the {@link NestedPrompt `NestedPrompt<T>`} for testing.
             */
            abstract class TestNestedPrompt extends NestedPrompt<any>
            {
                /**
                 * @inheritdoc
                 *
                 * @returns
                 * The result of the prompt.
                 */
                public override Run(): Promise<unknown>
                {
                    return super.Run();
                }
            }

            suite(
                nameof<TestNestedPrompt>((prompt) => prompt.Run),
                () =>
                {
                    let result: any = null;
                    let messageReceived = false;
                    let exitCode: number;

                    /**
                     * Spawns the test-script.
                     *
                     * @param managed
                     * A value indicating whether the managed {@link NestedPrompt `NestedPrompt<T>`} should be used.
                     */
                    async function SpawnTestScript(managed: boolean): Promise<void>
                    {
                        let child: ChildProcess;
                        child = fork(require.resolve("./executeNestedPrompt"), managed ? [TestContext.Default.ManagedArgument] : []);

                        child.on(
                            "message",
                            (message: any) =>
                            {
                                messageReceived = true;
                                result = message;
                            });

                        return new Promise(
                            (resolve) =>
                            {
                                child.on(
                                    "exit",
                                    (code) =>
                                    {
                                        exitCode = code;
                                        resolve();
                                    });
                            });
                    }

                    setup(
                        () =>
                        {
                            messageReceived = false;
                            result = null;
                        });

                    test(
                        `Checking whether running nested prompts in an ordinary \`${nameof<Prompt>()}\` causes an error…`,
                        async function()
                        {
                            this.timeout(10 * 1000);
                            this.slow(5 * 1000);
                            await SpawnTestScript(false);
                            ok(!messageReceived);
                            strictEqual(exitCode, 1);
                        });

                    test(
                        `Checking whether nested prompts can be executed in the \`${nameof(NestedPrompt)}\` class…`,
                        async function()
                        {
                            this.timeout(10 * 1000);
                            this.slow(5 * 1000);
                            await SpawnTestScript(true);
                            ok(messageReceived);
                            strictEqual(exitCode, 0);
                            ok(result);
                            ok(Object.keys(result).length > 0);
                        });
                });
        });
}
