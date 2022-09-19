import { EOL } from "node:os";
import inquirer from "inquirer";
import { stdin } from "mock-stdin";
import { NestedPrompt } from "../../../../Components/Inquiry/Prompts/NestedPrompt.js";
import { PromptBase } from "../../../../Components/Inquiry/Prompts/PromptBase.js";
import { TestContext } from "../../../TestContext.js";

(
    async () =>
    {
        let mockedStdin = stdin();
        let managed = process.argv.slice(1).some((argument) => argument === TestContext.Default.ManagedArgument);
        let promptModule = inquirer.createPromptModule();
        let type = "test" as undefined;
        let foodKey = "food";
        let promptConstructor: inquirer.prompts.PromptConstructor;

        let runSubPrompt = async (): Promise<unknown> =>
        {
            let result = inquirer.prompt(
                {
                    name: foodKey,
                    message: "Do you know how animals eat their food?"
                });

            process.nextTick(
                () =>
                {
                    mockedStdin.send("Yes");
                    mockedStdin.send(EOL);
                });

            return (await result)[foodKey];
        };

        if (managed)
        {
            promptConstructor = class extends NestedPrompt<any>
            {
                /**
                 * @inheritdoc
                 *
                 * @returns
                 * The result.
                 */
                protected async Prompt(): Promise<unknown>
                {
                    return runSubPrompt();
                }
            };
        }
        else
        {
            promptConstructor = class extends PromptBase<any>
            {
                /**
                 * @inheritdoc
                 *
                 * @returns
                 * The result.
                 */
                protected Run(): Promise<unknown>
                {
                    return runSubPrompt();
                }
            };

            process.on(
                "exit",
                () =>
                {
                    mockedStdin.restore();
                    console.log();
                });
        }

        promptModule.registerPrompt(type, promptConstructor);

        let result = await TestContext.Default.MockPrompts(
            promptModule,
            [
                {
                    type,
                    name: "food"
                },
                {
                    name: "watch",
                    message: "Watch closely!"
                },
                {
                    type: "confirm",
                    name: "confirm",
                    message: "Are you sure?"
                }
            ],
            [
                [],
                [
                    "No",
                    EOL
                ],
                [
                    "n",
                    EOL
                ]
            ],
            mockedStdin);

        mockedStdin.restore();
        process.send?.(result);
    })();
