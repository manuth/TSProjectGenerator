import { Answers, DistinctQuestion } from "inquirer";
import { IQuestionSetExtension } from "./IQuestionSetExtension";

/**
 * Represents a question which is part of a question-set.
 *
 * @template TResult
 * The type of the answer-hash of the inner questions.
 *
 * @template TAnswers
 * The type of the answers.
 */
export type SetQuestion<TResult, TAnswers extends Answers = Answers> =
    DistinctQuestion<TResult> &
    IQuestionSetExtension<TResult, TAnswers>;
