import { Answers, DistinctQuestion } from "inquirer";
import { IQuestionSetExtension } from "./IQuestionSetExtension";

/**
 * Represents a question which is part of a question-set.
 */
export type SetQuestion<TResult, TAnswers extends Answers = Answers> =
    DistinctQuestion<TResult> &
    IQuestionSetExtension<TResult, TAnswers>;
