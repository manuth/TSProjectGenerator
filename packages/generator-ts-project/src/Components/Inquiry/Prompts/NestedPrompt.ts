import { Interface } from "readline";
import { ReadStream } from "tty";
import { Answers, Question } from "inquirer";
import Prompt = require("inquirer/lib/prompts/base");
import { PromptCallback } from "./PromptCallback";

/**
 * Provides the functionality to display nested prompts.
 *
 * @template T
 * The type of the prompt-options.
 */
export abstract class NestedPrompt<T extends Question> extends Prompt<T>
{
    /**
     * Initializes a new instance of the {@link NestedPrompt `NestedPrompt<T>`} class.
     *
     * @param question
     * The question to prompt the user to answer.
     *
     * @param readLine
     * An object for reading from and writing to the console.
     *
     * @param answers
     * The answer-hash.
     */
    public constructor(question: T, readLine: Interface, answers: Answers)
    {
        super(question, readLine, answers);
    }

    /**
     * @inheritdoc
     *
     * @param resolve
     * The callback for resolving the result.
     */
    protected override _run(resolve: PromptCallback): void
    {
        (
            async () =>
            {
                resolve(await this.Run());
            })();
    }

    /**
     * Runs the prompt.
     *
     * @returns
     * The result of the prompt.
     */
    protected async Run(): Promise<unknown>
    {
        this.rl.pause();
        this.screen.render("\0", undefined);
        let result = await this.Prompt();
        this.rl.resume();
        ((this.rl as any).input as ReadStream)?.setRawMode?.(true);
        return result;
    }

    /**
     * Prompts the inner questions.
     *
     * @returns
     * The value to save to the answer-hash.
     */
    protected abstract Prompt(): Promise<unknown>;
}
