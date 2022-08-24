import inquirer = require("inquirer");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { QuestionSetPrompt } from "./QuestionSetPrompt";
import { SetQuestion } from "./SetQuestion";

/**
 * Provides options for the {@link QuestionSetPrompt `QuestionSetPrompt<TAnswers, TQuestion>`}.
 *
 * @template TResult
 * The type of the answer-hash of the inner questions.
 *
 * @template TAnswers
 * The type of the answers.
 */
export interface IQuestionSetQuestionOptions<TResult extends inquirer.Answers = inquirer.Answers, TAnswers extends inquirer.Answers = inquirer.Answers> extends inquirer.Question<TAnswers>
{
    /**
     * The prompt-types to register.
     */
    // eslint-disable-next-line @delagen/deprecation/deprecation
    promptTypes?: Record<string, inquirer.prompts.PromptConstructor>;

    /**
     * The questions to ask.
     */
    questions: inquirer.AsyncDynamicQuestionProperty<Array<SetQuestion<TResult, TAnswers>>>;
}
