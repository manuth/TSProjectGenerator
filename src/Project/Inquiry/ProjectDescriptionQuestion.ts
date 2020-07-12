import { Package } from "@manuth/package-json-editor";
import { join } from "upath";
import { QuestionBase } from "../../Inquiry/Question";
import { ITSProjectSettings } from "../ITSProjectSettings";
import { TSProjectSettingKey } from "../TSProjectSettingKey";

/**
 * Provides a question for asking for the module-name of a project.
 */
export class ProjectDescriptionQuestion<T extends ITSProjectSettings> extends QuestionBase<T>
{
    /**
     * @inheritdoc
     */
    public type = "input" as const;

    /**
     * @inheritdoc
     */
    public name = TSProjectSettingKey.Description;

    /**
     * Initializes a new instance of the `ProjectDescriptionQuestion` class.
     */
    public constructor()
    {
        super();
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
    public async message(answers: T): Promise<string>
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
    public async default(answers: T): Promise<string>
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
    public async validate(input: string, answers: T): Promise<string | boolean>
    {
        return true;
    }
}
