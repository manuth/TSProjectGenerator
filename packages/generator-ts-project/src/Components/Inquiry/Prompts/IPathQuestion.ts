import { Answers } from "inquirer";
import { IPathQuestionOptions } from "./IPathQuestionOptions";
import { PathPrompt } from "./PathPrompt";

/**
 * Provides options fot the {@link PathPrompt `PathPrompt<T>`}.
 *
 * @template T
 * The type of the answers.
 */
export interface IPathQuestion<T extends Answers = Answers> extends IPathQuestionOptions<T>
{
    /**
     * @inheritdoc
     */
    type: typeof PathPrompt.TypeName;
}
