import { resolve } from "path";
import { GeneratorOptions, IGenerator, QuestionBase } from "@manuth/extended-yo-generator";
import { InputQuestionOptions } from "inquirer";
import { isAbsolute } from "upath";
import { ITSProjectSettings } from "../Settings/ITSProjectSettings";
import { TSProjectSettingKey } from "../Settings/TSProjectSettingKey";

/**
 * Provides a question for asking for the destination-path of a project.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class TSProjectDestinationQuestion<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends QuestionBase<TSettings, TOptions> implements InputQuestionOptions<TSettings>
{
    /**
     * @inheritdoc
     */
    public name = TSProjectSettingKey.Destination;

    /**
     * Initializes a new instance of the {@link TSProjectDestinationQuestion `TSProjectDestinationQuestion<TSettings, TOptions>`} class.
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
        return "Where do you want to save your project to?";
    }

    /**
     * @inheritdoc
     *
     * @param answers
     * The answers provided by the user.
     *
     * @returns
     * The default value.
     */
    public override async Default(answers: TSettings): Promise<string>
    {
        return "./";
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
    public override async Filter(input: any, answers: TSettings): Promise<string>
    {
        return isAbsolute(input) ? input : resolve(this.Generator.destinationPath(input));
    }
}
