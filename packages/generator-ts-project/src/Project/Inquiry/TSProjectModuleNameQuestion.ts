import { GeneratorOptions, IGenerator } from "@manuth/extended-yo-generator";
import { Package } from "@manuth/package-json-editor";
import { pathExists } from "fs-extra";
import { InputQuestionOptions } from "inquirer";
import kebabCase = require("lodash.kebabcase");
import { join } from "upath";
import validate = require("validate-npm-package-name");
import { QuestionBase } from "../../Components/Inquiry/QuestionBase";
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
export class TSProjectModuleNameQuestion<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends QuestionBase<TSettings, TOptions> implements InputQuestionOptions<TSettings>
{
    /**
     * @inheritdoc
     */
    public name = TSProjectSettingKey.Name;

    /**
     * Initializes a new instance of the {@link TSProjectModuleNameQuestion `TSProjectModuleNameQuestion<TSettings, TOptions>`} class.
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
    public override async Default(answers: TSettings): Promise<string>
    {
        let fileName = join(answers[TSProjectSettingKey.Destination], "package.json");
        let originalName: string = null;

        if (await pathExists(fileName))
        {
            originalName = new Package(fileName).Name;
        }

        return originalName ?? this.CreateModuleName(answers);
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

    /**
     * Creates a new module-name.
     *
     * @param answers
     * The answers provided by the user.
     *
     * @returns
     * A new module-name for the module.
     */
    protected async CreateModuleName(answers: TSettings): Promise<string>
    {
        return kebabCase(answers[TSProjectSettingKey.DisplayName]);
    }
}
