import { Answers } from "inquirer";
import { IArrayQuestionOptions } from "./IArrayQuestionOptions.js";
import { SubGeneratorPrompt } from "./SubGeneratorPrompt.js";

/**
 * Provides options for the {@link SubGeneratorPrompt `SubGeneratorPrompt<T>`}.
 *
 * @template T
 * The type of the answers.
 */
export interface ISubGeneratorQuestion<T extends Answers = Answers> extends IArrayQuestionOptions<T>
{
    /**
     * @inheritdoc
     */
    type: typeof SubGeneratorPrompt.TypeName;
}
