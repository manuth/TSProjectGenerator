import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { ChoiceCollection, KeyUnion, Question } from "inquirer";

/**
 * Represents a question.
 */
export abstract class QuestionBase<TSettings extends IGeneratorSettings = IGeneratorSettings, TOptions extends GeneratorOptions = GeneratorOptions> implements Question<TSettings>
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
    private generator: IGenerator<TSettings, TOptions>;

    /**
     * Initializes a new instance of the `QuestionBase` class.
     *
     * @param generator
     * The generator of the question.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>)
    {
        this.generator = generator;
    }

    /**
     * Gets the generator of the question.
     */
    protected get Generator(): IGenerator<TSettings, TOptions>
    {
        return this.generator;
    }

    /**
     * @inheritdoc
     */
    public abstract get name(): KeyUnion<TSettings>;

    /**
     * @inheritdoc
     *
     * @param answers
     * The answers provided by the user.
     *
     * @returns
     * The message to show to the user.
     */
    public message = async (answers: TSettings): Promise<string> =>
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
    public default = async (answers: TSettings): Promise<any> =>
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
    public filter = async (input: any, answers: TSettings): Promise<any> =>
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
    public when = async (answers: TSettings): Promise<boolean> =>
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
    public validate = async (input: any, answers: TSettings): Promise<string | boolean> =>
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
    public choices = async (answers: TSettings): Promise<ChoiceCollection<TSettings>> =>
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
    protected async Default(answers: TSettings): Promise<any>
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
    protected async Filter(input: any, answers: TSettings): Promise<any>
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
    protected async When(answers: TSettings): Promise<boolean>
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
    protected async Validate(input: any, answers: TSettings): Promise<boolean | string>
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
    protected async Choices(answers: TSettings): Promise<ChoiceCollection<TSettings>>
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
    protected abstract Message(answers: TSettings): Promise<string>;
}
