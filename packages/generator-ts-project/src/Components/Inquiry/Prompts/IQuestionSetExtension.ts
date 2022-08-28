import { Answers, Question } from "inquirer";
import { QuestionSetProperty } from "./QuestionSetProperty.js";

/**
 * Represents an extension for question-set questions.
 *
 * @template TResult
 * The type of the answer-hash of the inner questions.
 *
 * @template TAnswers
 * The type of the answers.
 */
export interface IQuestionSetExtension<TResult, TAnswers extends Answers = Answers> extends Question<TResult>
{
    /**
     * @inheritdoc
     */
    message?: QuestionSetProperty<string, TResult, TAnswers>;

    /**
     * @inheritdoc
     */
    default?: QuestionSetProperty<any, TResult, TAnswers>;

    /**
     * @inheritdoc
     */
    when?: QuestionSetProperty<boolean, TResult, TAnswers> | undefined;

    /**
     * @inheritdoc
     *
     * @param input
     * The answer provided by the user.
     *
     * @param result
     * The result of the prompt.
     *
     * @param answers
     * The answers provided by the user.
     */
    filter?(input: any, result: TResult, answers?: TAnswers): any;

    /**
     * @inheritdoc
     *
     * @param input
     * The answer provided by the user.
     *
     * @param result
     * The result of the prompt.
     *
     * @param answers
     * The answers provided by the user.
     *
     * @returns
     * Either a value indicating whether the answer is valid or a `string` which describes the error.
     */
    validate?(input: any, result?: TResult, answers?: TAnswers): boolean | string | Promise<boolean | string>;
}
