import { Answers, Question } from "inquirer";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ArrayPrompt } from "./ArrayPrompt";

/**
 * Provides options for the {@link ArrayPrompt `ArrayPrompt<TQuestion, TItem>`}.
 *
 * @template T
 * The type of the answers.
 */
export interface IArrayQuestionOptions<T extends Answers = Answers> extends Question<T>
{
    /**
     * @inheritdoc
     */
    default?: never;

    /**
     * Gets or sets a value indicating whether the prompt to repeat the questions should be answered with `yes` by default.
     */
    defaultRepeat?: boolean;
}
