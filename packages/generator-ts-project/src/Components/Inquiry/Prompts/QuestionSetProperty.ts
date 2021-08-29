/**
 * Represents a dynamic proparty for a question-set.
 *
 * @template T
 * The type of the property.
 *
 * @template TResult
 * The type of the result.
 *
 * @template TAnswers
 * The type of the answers.
 */
export type QuestionSetProperty<T, TResult, TAnswers> = T | ((result: TResult, answers?: TAnswers) => (T | Promise<T>));
