import { GeneratorOptions, IGenerator, Question } from "@manuth/extended-yo-generator";
import { PackageType } from "@manuth/package-json-editor";
import { ITSProjectSettings } from "../Settings/ITSProjectSettings.js";
import { TSProjectSettingKey } from "../Settings/TSProjectSettingKey.js";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { TSProjectGenerator } from "../TSProjectGenerator.js";
import { TSProjectDescriptionQuestion } from "./TSProjectDescriptionQuestion.js";
import { TSProjectDestinationQuestion } from "./TSProjectDestinationQuestion.js";
import { TSProjectDisplayNameQuestion } from "./TSProjectDisplayNameQuestion.js";
import { TSProjectModuleNameQuestion } from "./TSProjectModuleNameQuestion.js";

/**
 * Provides questions for asking for the {@link TSProjectGenerator `TSProjectGenerator<TSettings, TOptions>`}.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class TSProjectQuestionCollection<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions>
{
    /**
     * The generator of the question-collection.
     */
    private generator: IGenerator<TSettings, TOptions>;

    /**
     * Initializes a new instance of the {@link TSProjectQuestionCollection `TSProjectQuestionCollection<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of the question-collection.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>)
    {
        this.generator = generator;
    }

    /**
     * Gets the generator of the question-collection.
     */
    protected get Generator(): IGenerator<TSettings, TOptions>
    {
        return this.generator;
    }

    /**
     * Gets a question to ask for the destination to write the project to.
     */
    protected get DestinationQuestion(): Question<TSettings>
    {
        return new TSProjectDestinationQuestion(this.Generator) as any;
    }

    /**
     * Gets a question to ask for the display-name of the project.
     */
    protected get DisplayNameQuestion(): Question<TSettings>
    {
        return new TSProjectDisplayNameQuestion(this.Generator);
    }

    /**
     * Gets a question to ask for the name of the module.
     */
    protected get ModuleNameQuestion(): Question<TSettings>
    {
        return new TSProjectModuleNameQuestion(this.Generator);
    }

    /**
     * Gets a question to ask for the kind of the module.
     */
    protected get ModuleKindQuestion(): Question<TSettings>
    {
        return {
            type: "list",
            name: TSProjectSettingKey.ESModule,
            default: true,
            message: "What kind of package do you wish to create?",
            choices: [
                {
                    name: nameof(PackageType.CommonJS),
                    value: false
                },
                {
                    name: nameof(PackageType.ESModule),
                    value: true
                }
            ]
        };
    }

    /**
     * Gets a question to ask for the description.
     */
    protected get DescriptionQuestion(): Question<TSettings>
    {
        return new TSProjectDescriptionQuestion(this.Generator);
    }

    /**
     * Gets the questions of the project.
     */
    public get Questions(): Array<Question<TSettings>>
    {
        return [
            this.DestinationQuestion,
            this.DisplayNameQuestion,
            this.ModuleNameQuestion,
            this.ModuleKindQuestion,
            this.DescriptionQuestion
        ];
    }
}
