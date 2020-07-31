import { IGenerator } from "@manuth/extended-yo-generator";
import { Question, Answers, KeyUnion, ChoiceCollection } from "inquirer";

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
     * The message to show to the user.
     */
    public message = async (answers: T): Promise<string> =>
    {
        return this.Message(answers);
    };

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
        return this.Default(answers);
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
    public filter = async (input: any, answers: T): Promise<any> =>
    {
        return this.Filter(input, answers);
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
        return this.When(answers);
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
        return this.Validate(input, answers);
    };

    /**
     * @inheritdoc
     *
     * @param answers
     * The answers provided by the user.
     *
     * @returns
     * The choices the user can choose from.
     */
    public choices = async (answers: T): Promise<ChoiceCollection<T>> =>
    {
        return this.Choices(answers);
    };

    /**
     * Gets the default value of the question.
     *
     * @param answers
     * The answers provided by the user.
     *
     * @returns
     * The default value.
     */
    protected async Default(answers: T): Promise<any>
    {
        return null;
    }

    /**
     * Post-processes the answer.
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
    protected async Filter(input: any, answers: T): Promise<any>
    {
        return input;
    }

    /**
     * Gets a value indicating whether the question should be prompted.
     *
     * @param answers
     * The answers provided by the user.
     *
     * @returns
     * A value indicating whether the question should be asked.
     */
    protected async When(answers: T): Promise<boolean>
    {
        return true;
    }

    /**
     * Validates the integrity of the answer.
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
    protected async Validate(input: any, answers: T): Promise<boolean | string>
    {
        return true;
    }

    /**
     * The choices of the prompt.
     *
     * @param answers
     * The answers provided by the user.
     *
     * @returns
     * The choices the user can choose from.
     */
    protected async Choices(answers: T): Promise<ChoiceCollection<T>>
    {
        return [];
    }

    /**
     * Gets the message to show to the user.
     *
     * @param answers
     * The answers provided by the user.
     *
     * @returns
     * The message to show to the user.
     */
    protected abstract async Message(answers: T): Promise<string>;
}
