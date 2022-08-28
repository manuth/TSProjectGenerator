import { resolve } from "path";
import { GeneratorOptions, IGenerator, QuestionBase } from "@manuth/extended-yo-generator";
import upath from "upath";
import { IPathQuestionOptions } from "../../Components/Inquiry/Prompts/IPathQuestionOptions.js";
import { PathPrompt } from "../../Components/Inquiry/Prompts/PathPrompt.js";
import { ITSProjectSettings } from "../Settings/ITSProjectSettings.js";
import { TSProjectSettingKey } from "../Settings/TSProjectSettingKey.js";

const { isAbsolute } = upath;

/**
 * Provides a question for asking for the destination-path of a project.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class TSProjectDestinationQuestion<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends QuestionBase<TSettings, TOptions> implements IPathQuestionOptions<TSettings>
{
    /**
     * @inheritdoc
     */
    public type = PathPrompt.TypeName as typeof PathPrompt.TypeName;

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
    public override async Filter(input: string, answers: TSettings): Promise<string>
    {
        return isAbsolute(input) ? input : resolve(this.Generator.destinationPath(input));
    }
}
