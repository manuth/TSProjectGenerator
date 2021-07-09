import { Answers } from "inquirer";
import { ISubGeneratorQuestionOptions } from "./ISubGeneratorQuestionOptions";
import { SubGeneratorPrompt } from "./SubGeneratorPrompt";

/**
 * Provides options for the {@link SubGeneratorPrompt `SubGeneratorPrompt<T>`}.
 *
 * @template T
 * The type of the answers.
 */
export interface ISubGeneratorQuestion<T extends Answers = Answers> extends ISubGeneratorQuestionOptions<T>
{
    /**
     * @inheritdoc
     */
    type: typeof SubGeneratorPrompt.TypeName;
}
