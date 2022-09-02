import { strictEqual } from "node:assert";
import { createInterface, Interface } from "node:readline";
import { Question } from "inquirer";
import { MockSTDIN, stdin } from "mock-stdin";
import MuteStream from "mute-stream";
import { Random } from "random-js";
import { TestPrompt } from "../../Inquiry/TestPrompt.js";

/**
 * Registers tests for the {@link TestPrompt `TestPrompt`} class.
 */
export function TestPromptTests(): void
{
    suite(
        nameof(TestPrompt),
        () =>
        {
            let random: Random;
            let prompt: TestPrompt;
            let mockedStdin: MockSTDIN;
            let readLine: Interface;
            let expectedResult: string;

            suiteSetup(
                () =>
                {
                    random = new Random();
                });

            setup(
                () =>
                {
                    let muteStream = new MuteStream();
                    muteStream.pipe(process.stdout);
                    mockedStdin = stdin();
                    expectedResult = random.string(10);

                    readLine = createInterface(
                        {
                            terminal: true,
                            input: process.stdin,
                            output: muteStream
                        });

                    prompt = new TestPrompt(
                        {
                            name: random.string(5),
                            default: expectedResult
                        },
                        readLine,
                        {});
                });

            teardown(
                () =>
                {
                    readLine.close();
                    mockedStdin.restore();
                });

            suite(
                nameof<TestPrompt>((prompt) => prompt.run),
                () =>
                {
                    test(
                        `Checking whether the prompt resolves to the prompt's \`${nameof<Question>((q) => q.default)}\`-option…`,
                        async () =>
                        {
                            strictEqual(await prompt.run(), expectedResult);
                        });
                });
        });
}
