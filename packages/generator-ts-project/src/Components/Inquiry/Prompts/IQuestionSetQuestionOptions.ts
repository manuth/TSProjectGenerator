import inquirer, { Answers, AsyncDynamicQuestionProperty, Question } from "inquirer";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { QuestionSetPrompt } from "./QuestionSetPrompt.js";
import { SetQuestion } from "./SetQuestion.js";

/**
 * Provides options for the {@link QuestionSetPrompt `QuestionSetPrompt<TAnswers, TQuestion>`}.
 *
 * @template TResult
 * The type of the answer-hash of the inner questions.
 *
 * @template TAnswers
 * The type of the answers.
 */
export interface IQuestionSetQuestionOptions<TResult extends Answers = Answers, TAnswers extends Answers = Answers> extends Question<TAnswers>
{
    /**
     * The prompt-types to register.
     */
    promptTypes?: Record<string, inquirer.prompts.PromptConstructor>;

    /**
     * The questions to ask.
     */
    questions: AsyncDynamicQuestionProperty<Array<SetQuestion<TResult, TAnswers>>>;
}
