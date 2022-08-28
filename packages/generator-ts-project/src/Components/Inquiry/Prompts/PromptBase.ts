import { Interface } from "readline";
import { Answers, Question } from "inquirer";
import Prompt from "inquirer/lib/prompts/base.js";
import { PromptCallback } from "./PromptCallback.js";

/**
 * Provides a basic implementation of the {@link Prompt `Prompt<T>`} class.
 *
 * @template T
 * The type of the options for the question.
 */
export abstract class PromptBase<T extends Question> extends Prompt<T>
{
    /**
     * Initializes a new instance of the {@link PromptBase `PromptBase<T>`} class.
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
    protected abstract Run(): Promise<unknown>;
}
