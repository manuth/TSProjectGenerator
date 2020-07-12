import parsePackageName = require("parse-pkg-name");
import { ITSProjectSettings } from "../../../Project/ITSProjectSettings";
import { ProjectModuleNameQuestion } from "../../../Project/Inquiry/ProjectModuleNameQuestion";

/**
 * Provides a question for asking for the module-name of a project.
 */
export class GeneratorModuleNameQuestion<T extends ITSProjectSettings> extends ProjectModuleNameQuestion<T>
{
    /**
     * Initializes a new instance of the `GeneratorModuleNameQuestion` class.
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
        return "Please enter a description for your generator.";
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
        return `generator-${(await super.default(answers)).replace(/(generator-)?(.*?)(generator)?$/i, "$2")}`;
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
    public async validate(input: string, answers?: T): Promise<boolean | string>
    {
        let result = await super.validate(input, answers);

        if ((typeof result === "boolean") && result)
        {
            let packageName = parsePackageName(input).name;
            return /^generator-.+/.test(packageName) ? true : `The package-name \`${packageName}\` must start with \`generator-\`.`;
        }
        else
        {
            return result;
        }
    }
}
