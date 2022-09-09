import { Interface } from "node:readline";
import { Answers, Question } from "inquirer";
import { SuspendablePrompt } from "./SuspendablePrompt.js";

/**
 * Provides the functionality to display nested prompts.
 *
 * @template T
 * The type of the options for the question.
 */
export abstract class NestedPrompt<T extends Question> extends SuspendablePrompt<T>
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
     * Runs the prompt.
     *
     * @returns
     * The result of the prompt.
     */
    protected async Run(): Promise<unknown>
    {
        await this.Suspend();
        this.screen.render("\0", undefined);
        let result = await this.Prompt();
        await this.Resume();
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
