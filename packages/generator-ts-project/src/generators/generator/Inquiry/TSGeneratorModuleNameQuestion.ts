import { GeneratorOptions, IGenerator } from "@manuth/extended-yo-generator";
import parsePackageName = require("parse-pkg-name");
import { TSProjectModuleNameQuestion } from "../../../Project/Inquiry/TSProjectModuleNameQuestion";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";

/**
 * Provides a question for asking for the module-name of a project.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class TSGeneratorModuleNameQuestion<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends TSProjectModuleNameQuestion<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link TSGeneratorModuleNameQuestion `TSGeneratorModuleNameQuestion<TSettings, TOptions>`} class.
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
     * @param input
     * The input provided by the user.
     *
     * @param answers
     * The answers provided by the user.
     *
     * @returns
     * Either a value indicating whether the input is valid or a string which contains an error-message.
     */
    public override async Validate(input: string, answers: TSettings): Promise<boolean | string>
    {
        let result = await super.Validate(input, answers);

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

    /**
     * Creates a new module-name.
     *
     * @param answers
     * The answers provided by the user.
     *
     * @returns
     * A new module-name for the module.
     */
    protected override async CreateModuleName(answers: TSettings): Promise<string>
    {
        return `generator-${(await super.CreateModuleName(answers)).replace(
            /^(generator-)/i, ""
        ).replace(/-generator$/i, "")}`;
    }
}
