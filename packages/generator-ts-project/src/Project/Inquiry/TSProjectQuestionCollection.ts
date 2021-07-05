import { GeneratorOptions, IGenerator, Question } from "@manuth/extended-yo-generator";
import { ITSProjectSettings } from "../Settings/ITSProjectSettings";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { TSProjectGenerator } from "../TSProjectGenerator";
import { TSProjectDescriptionQuestion } from "./TSProjectDescriptionQuestion";
import { TSProjectDestinationQuestion } from "./TSProjectDestinationQuestion";
import { TSProjectDisplayNameQuestion } from "./TSProjectDisplayNameQuestion";
import { TSProjectModuleNameQuestion } from "./TSProjectModuleNameQuestion";

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
        return new TSProjectDestinationQuestion(this.Generator);
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
            this.DescriptionQuestion
        ];
    }
}
