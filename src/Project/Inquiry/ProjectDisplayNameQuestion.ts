import { InputQuestionOptions } from "inquirer";
import { basename } from "upath";
import { QuestionBase } from "../../Components/Inquiry/QuestionBase";
import { ITSProjectSettings } from "../ITSProjectSettings";
import { TSProjectSettingKey } from "../TSProjectSettingKey";

/**
 * Provides a question for asking for a human-readable name of a project.
 */
export class ProjectDisplayNameQuestion<T extends ITSProjectSettings> extends QuestionBase<T> implements InputQuestionOptions<T>
{
    /**
     * @inheritdoc
     */
    public type = "input" as const;

    /**
     * @inheritdoc
     */
    public name = TSProjectSettingKey.DisplayName;

    /**
     * Initializes a new instance of the `ProjectDisplayNameQuestion` class.
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
     * The message to show to the user.
     */
    public async message(answers: T): Promise<string>
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
    public async default(answers: T): Promise<string>
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
    public async validate(input: string, answers?: T): Promise<string | boolean>
    {
        return (input.trim().length > 0) ? true : "The name must not be empty!";
    }
}
