import { Interface } from "readline";
import { ReadStream } from "tty";
import { Answers, Question } from "inquirer";
import { PromptBase } from "./PromptBase";

/**
 * Represents a prompt which is capable of being suspended.
 *
 * @template T
 * The type of the options for the question.
 */
export abstract class SuspendablePrompt<T extends Question> extends PromptBase<T>
{
    /**
     * Initializes a new instance of the {@link SuspendablePrompt `SuspendablePrompt<T>`} class.
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
     * Suspends the prompt.
     */
    protected async Suspend(): Promise<void>
    {
        this.rl.pause();
    }

    /**
     * Resumes the prompt.
     */
    protected async Resume(): Promise<void>
    {
        this.rl.resume();
        ((this.rl as any).input as ReadStream)?.setRawMode?.(true);
    }
}
