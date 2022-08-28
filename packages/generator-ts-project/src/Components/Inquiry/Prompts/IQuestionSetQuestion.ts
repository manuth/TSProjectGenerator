import { Answers } from "inquirer";
import { IQuestionSetQuestionOptions } from "./IQuestionSetQuestionOptions.js";
import { QuestionSetPrompt } from "./QuestionSetPrompt.js";

/**
 * Provides options for the {@link QuestionSetPrompt `QuestionSetPrompt<TAnswers, TQuestion>`}.
 *
 * @template TResult
 * The type of the answer-hash of the inner questions.
 *
 * @template TAnswers
 * The type of the answers.
 */
export interface IQuestionSetQuestion<TResult extends Answers = Answers, TAnswers extends Answers = Answers> extends IQuestionSetQuestionOptions<TResult, TAnswers>
{
    /**
     * @inheritdoc
     */
    type: typeof QuestionSetPrompt.TypeName;
}
