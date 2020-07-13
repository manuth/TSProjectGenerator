import { InputQuestionOptions } from "inquirer";
import kebabCase = require("lodash.kebabcase");
import validate = require("validate-npm-package-name");
import { QuestionBase } from "../../Components/Inquiry/QuestionBase";
import { ITSProjectSettings } from "../Settings/ITSProjectSettings";
import { TSProjectSettingKey } from "../Settings/TSProjectSettingKey";

/**
 * Provides a question for asking for the module-name of a project.
 */
export class TSProjectModuleNameQuestion<T extends ITSProjectSettings> extends QuestionBase<T> implements InputQuestionOptions<T>
{
    /**
     * @inheritdoc
     */
    public type = "input" as const;

    /**
     * @inheritdoc
     */
    public name = TSProjectSettingKey.Name;

    /**
     * Initializes a new instance of the `TSProjectModuleNameQuestion<T>` class.
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
        return "What's the name of the npm package?";
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
        return kebabCase(answers[TSProjectSettingKey.DisplayName]);
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
        let result = validate(input);
        let errors = (result.errors ?? []).concat(result.warnings ?? []);

        if (result.validForNewPackages)
        {
            return true;
        }
        else
        {
            return errors[0] ?? "Please provide a name according to the npm naming-conventions.";
        }
    }
}
