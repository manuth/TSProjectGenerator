import { Interface } from "node:readline";
import inquirer, { Answers, DistinctQuestion } from "inquirer";
import { IArrayPromptHash } from "./IArrayPromptHash.js";
import { IArrayQuestionOptions } from "./IArrayQuestionOptions.js";
import { SuspendablePrompt } from "./SuspendablePrompt.js";

/**
 * Provides the functionality to prompt for an array of objects.
 *
 * @template TQuestion
 * The type of the options for the question.
 *
 * @template TItem
 * The type of the items to prompt the user for.
 */
export abstract class ArrayPrompt<TQuestion extends IArrayQuestionOptions, TItem> extends SuspendablePrompt<TQuestion>
{
    /**
     * Initializes a new instance of the {@link ArrayPrompt `ArrayPrompt<TQuestion, TItem>`} class.
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
    public constructor(question: TQuestion, readLine: Interface, answers: Answers)
    {
        super(question, readLine, answers);
    }

    /**
     * Runs the prompt.
     *
     * @returns
     * The result of the prompt.
     */
    protected async Run(): Promise<TItem[]>
    {
        let result: TItem[] = [];

        do
        {
            this.screen.render(`${this.getQuestion()}\n`, undefined);
            await this.Suspend();
            result.push(await this.PromptItem([...result]));
            await this.Resume();
            this.screen.height = 1;
        }
        while ((await this.PromptAdd(result)).addNew ?? this.opt.defaultRepeat);

        return result;
    }

    /**
     * Prompts for a new item to add to the result.
     *
     * @param items
     * The currently stored items.
     *
     * @returns
     * The new item to add to the result.
     */
    protected abstract PromptItem(items: readonly TItem[]): Promise<TItem>;

    /**
     * Gets a set of questions for asking the user whether another item should be added.
     *
     * @param items
     * The currently stored items.
     *
     * @returns
     * A question for asking the user whether another item should be added.
     */
    protected async GetRepetitionQuestion(items: readonly TItem[]): Promise<DistinctQuestion<IArrayPromptHash>>
    {
        return {
            type: "confirm",
            name: nameof<IArrayPromptHash>((hash) => hash.addNew),
            default: this.opt.defaultRepeat,
            message: "Do you want to add another item?"
        };
    }

    /**
     * Prompts the user for answering whether another item should be added.
     *
     * @param items
     * The currently stored items.
     *
     * @returns
     * An answer-hash containing a value indicating whether another item should be added.
     */
    protected async PromptAdd(items: readonly TItem[]): Promise<IArrayPromptHash>
    {
        return inquirer.prompt(
            [
                await this.GetRepetitionQuestion(items)
            ],
            {
                ...this.answers,
                [this.opt.name]: [...items]
            });
    }
}
