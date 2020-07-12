import { resolve } from "path";
import { isAbsolute } from "upath";
import { QuestionBase } from "../../Inquiry/Question";
import { ITSProjectSettings } from "../ITSProjectSettings";
import { TSProjectSettingKey } from "../TSProjectSettingKey";

/**
 * Provides a question for asking for the destination-path of a project.
 */
export class ProjectDestinationQuestion<T extends ITSProjectSettings> extends QuestionBase<T>
{
    /**
     * @inheritdoc
     */
    public type = "input" as const;

    /**
     * @inheritdoc
     */
    public name = TSProjectSettingKey.Destination;

    /**
     * Initializes a new instance of the `ProjectDestinationQuestion` class.
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
    public async default(answers: T): Promise<string>
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
    public async filter(input: any, answers?: T): Promise<string>
    {
        return isAbsolute(input) ? input : resolve(process.cwd(), input);
    }
}
