import { GeneratorOptions, IGenerator, QuestionBase } from "@manuth/extended-yo-generator";
import { InputQuestionOptions } from "inquirer";
import { basename } from "upath";
import { ITSProjectSettings } from "../Settings/ITSProjectSettings";
import { TSProjectSettingKey } from "../Settings/TSProjectSettingKey";

/**
 * Provides a question for asking for a human-readable name of a project.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class TSProjectDisplayNameQuestion<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends QuestionBase<TSettings, TOptions> implements InputQuestionOptions<TSettings>
{
    /**
     * @inheritdoc
     */
    public name = TSProjectSettingKey.DisplayName;

    /**
     * Initializes a new instance of the {@link TSProjectDisplayNameQuestion `TSProjectDisplayNameQuestion<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of the question.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>)
    {
        super(generator);
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
    public async Message(answers: TSettings): Promise<string>
    {
        return "What's the name of your project?";
    }

    /**
     * @inheritdoc
     *
     * @param answers
     * The answers provided by the user.
     *
     * @returns
     * The default value for this question.
     */
    public override async Default(answers: TSettings): Promise<string>
    {
        return basename(answers[TSProjectSettingKey.Destination]);
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
     * Either a value indicating whether the input is valid or a string which contains an error-message.
     */
    public override async Validate(input: string, answers: TSettings): Promise<string | boolean>
    {
        return (input.trim().length > 0) ? true : "The name must not be empty!";
    }
}
