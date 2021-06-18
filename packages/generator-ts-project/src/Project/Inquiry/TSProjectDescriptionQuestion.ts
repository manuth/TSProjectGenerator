import { GeneratorOptions, IGenerator } from "@manuth/extended-yo-generator";
import { Package } from "@manuth/package-json-editor";
import { InputQuestionOptions } from "inquirer";
import { join } from "upath";
import { QuestionBase } from "../../Components/Inquiry/QuestionBase";
import { ITSProjectSettings } from "../Settings/ITSProjectSettings";
import { TSProjectSettingKey } from "../Settings/TSProjectSettingKey";

/**
 * Provides a question for asking for the module-name of a project.
 */
export class TSProjectDescriptionQuestion<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends QuestionBase<TSettings, TOptions> implements InputQuestionOptions<TSettings>
{
    /**
     * @inheritdoc
     */
    public name = TSProjectSettingKey.Description;

    /**
     * Initializes a new instance of the `TSProjectDescriptionQuestion` class.
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
