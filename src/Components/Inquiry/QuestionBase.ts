import { IGenerator } from "@manuth/extended-yo-generator";
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
     * The generator of the question.
     */
    private generator: IGenerator<T>;

    /**
     * Initializes a new instance of the `QuestionBase<T>` class.
     *
     * @param generator
     * The generator of the question.
     */
    public constructor(generator: IGenerator<T>)
    {
        this.generator = generator;
    }

    /**
     * Gets the generator of the question.
     */
    protected get Generator(): IGenerator<T>
    {
        return this.generator;
    }

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
    public default = async (answers: T): Promise<any> =>
    {
        return null;
    };

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
    public filter = async (input: any, answers?: T): Promise<any> =>
    {
        return input;
    };

    /**
     * @inheritdoc
     *
     * @param answers
     * The answers provided by the user.
     *
     * @returns
     * A value indicating whether the question should be asked.
     */
    public when = async (answers: T): Promise<boolean> =>
    {
        return true;
    };

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
    public validate = async (input: any, answers: T): Promise<string | boolean> =>
    {
        return true;
    };

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
