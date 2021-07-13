import { GeneratorOptions, IGenerator, QuestionBase } from "@manuth/extended-yo-generator";
import { Package } from "@manuth/package-json-editor";
import { InputQuestionOptions } from "inquirer";
import { join } from "upath";
import { ITSProjectSettings } from "../Settings/ITSProjectSettings";
import { TSProjectSettingKey } from "../Settings/TSProjectSettingKey";

/**
 * Provides a question for asking for the module-name of a project.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class TSProjectDescriptionQuestion<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends QuestionBase<TSettings, TOptions> implements InputQuestionOptions<TSettings>
{
    /**
     * @inheritdoc
     */
    public name = TSProjectSettingKey.Description;

    /**
     * Initializes a new instance of the {@link TSProjectDescriptionQuestion `TSProjectDescriptionQuestion<TSettings, TOptions>`} class.
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
     * The message which is shown to the user.
     */
    public async Message(answers: TSettings): Promise<string>
    {
        return "Please enter a description for your project.";
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
        let npmPackage = new Package(join(answers[TSProjectSettingKey.Destination], ".json"), {});
        await npmPackage.Normalize();
        return npmPackage.Description;
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
        return true;
    }
}
