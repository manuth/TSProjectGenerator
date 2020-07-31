import { IGenerator } from "@manuth/extended-yo-generator";
import { InputQuestionOptions } from "inquirer";
import { basename } from "upath";
import { QuestionBase } from "../../Components/Inquiry/QuestionBase";
import { ITSProjectSettings } from "../Settings/ITSProjectSettings";
import { TSProjectSettingKey } from "../Settings/TSProjectSettingKey";

/**
 * Provides a question for asking for a human-readable name of a project.
 */
export class TSProjectDisplayNameQuestion<T extends ITSProjectSettings> extends QuestionBase<T> implements InputQuestionOptions<T>
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
     * Initializes a new instance of the `TSProjectDisplayNameQuestion<T>` class.
     *
     * @param generator
     * The generator of the question.
     */
    public constructor(generator: IGenerator<T>)
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
    public message = async (answers: T): Promise<string> =>
    {
        return "What's the name of your project?";
    };

    /**
     * @inheritdoc
     *
     * @param answers
     * The answers provided by the user.
     *
     * @returns
     * The default value for this question.
     */
    public default = async (answers: T): Promise<string> =>
    {
        return basename(answers[TSProjectSettingKey.Destination]);
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
     * Either a value indicating whether the input is valid or a string which contains an error-message.
     */
    public validate = async (input: string, answers?: T): Promise<string | boolean> =>
    {
        return (input.trim().length > 0) ? true : "The name must not be empty!";
    };
}
