import { Interface } from "readline";
import { PromptBase } from "@manuth/generator-ts-project";
import { InputQuestionOptions } from "inquirer";

/**
 * Provides a prompt for testing.
 */
export class TestPrompt extends PromptBase<InputQuestionOptions>
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
    public constructor(question: InputQuestionOptions, readLine: Interface, answers: any)
    {
        super(question, readLine, answers);
    }

    /**
     * @inheritdoc
     *
     * @returns
     * The result of the prompt.
     */
    protected Run(): Promise<unknown>
    {
        this.screen.render("", undefined);
        return this.opt.default;
    }
}
