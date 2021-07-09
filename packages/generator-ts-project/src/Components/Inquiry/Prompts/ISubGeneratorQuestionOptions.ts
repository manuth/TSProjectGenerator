import { Answers, ConfirmQuestionOptions } from "inquirer";

/**
 * Provides options for the {@link SubGeneratorPrompt `SubGeneratorPrompt<T>`}.
 *
 * @template T
 * The type of the answers.
 */
export interface ISubGeneratorQuestionOptions<T extends Answers = Answers> extends ConfirmQuestionOptions<T>
{
    /**
     * @inheritdoc
     */
    default?: null;

    /**
     * Gets or sets a value indicating whether the prompt to repeat the questions should be answered with `yes` by default.
     */
    defaultRepeat?: boolean;
}
