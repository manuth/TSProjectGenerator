import { Question, Answers, KeyUnion } from "inquirer";

/**
 * Represents a question.
 */
export abstract class QuestionBase<T extends Answers = Answers> implements Question<T>
{
    /**
     * @inheritdoc
     */
    public prefix?: string;

    /**
     * @inheritdoc
     */
    public suffix?: string;

    /**
     * Initializes a new instance of the `QuestionBase` class.
     */
    public constructor()
    { }

    /**
     * @inheritdoc
     */
    public abstract get type(): string;

    /**
     * @inheritdoc
     */
    public abstract get name(): KeyUnion<T>;

    /**
     * @inheritdoc
     *
     * @param answers
     * The answers provided by the user.
     *
     * @returns
     * The default value.
     */
    public async default(answers: T): Promise<any>
    {
        return null;
    }

    /**
     * @inheritdoc
     *
     * @param input
     * The input provided by the user.
     *
     * @param answers
     * The answers provided by the user.
     *
     * @returns
     * The filtered value.
     */
    public async filter(input: any, answers?: T): Promise<any>
    {
        return input;
    }

    /**
     * @inheritdoc
     *
     * @param answers
     * The answers provided by the user.
     *
     * @returns
     * A value indicating whether the question should be asked.
     */
    public async when(answers: T): Promise<boolean>
    {
        return true;
    }

    /**
     * @inheritdoc
     *
     * @param input
     * The answer provided by the user.
     *
     * @param answers
     * The answers provided by the user.
     *
     * @returns
     * Either a value indicating whether the answer is valid or a `string` which describes the error.
     */
    public async validate(input: any, answers: T): Promise<string | boolean>
    {
        return true;
    }

    /**
     * @inheritdoc
     *
     * @param answers
     * The answers provided by the user.
     *
     * @returns
     * The message to show to the user.
     */
    public abstract async message(answers: T): Promise<string>;
}
