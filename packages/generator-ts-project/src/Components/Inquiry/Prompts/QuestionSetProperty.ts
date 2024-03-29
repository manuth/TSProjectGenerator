/**
 * Represents a dynamic property for a question-set.
 *
 * @template T
 * The type of the property.
 *
 * @template TResult
 * The type of the answer-hash of the inner questions.
 *
 * @template TAnswers
 * The type of the answers.
 */
export type QuestionSetProperty<T, TResult, TAnswers> = T | Promise<T> | ((result: TResult, answers?: TAnswers) => (T | Promise<T>));
