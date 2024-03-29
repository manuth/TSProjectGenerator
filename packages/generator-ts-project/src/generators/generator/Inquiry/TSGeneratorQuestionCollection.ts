import { GeneratorOptions, IGenerator, Question } from "@manuth/extended-yo-generator";
import { TSProjectQuestionCollection } from "../../../Project/Inquiry/TSProjectQuestionCollection.js";
import { ITSGeneratorSettings } from "../Settings/ITSGeneratorSettings.js";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { TSGeneratorGenerator } from "../TSGeneratorGenerator.js";
import { TSGeneratorDescriptionQuestion } from "./TSGeneratorDescriptionQuestion.js";
import { TSGeneratorModuleNameQuestion } from "./TSGeneratorModuleNameQuestion.js";

/**
 * Provides questions for asking for the {@link TSGeneratorGenerator `TSGeneratorGenerator<TSettings, TOptions>`}-creation.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class TSGeneratorQuestionCollection<TSettings extends ITSGeneratorSettings, TOptions extends GeneratorOptions> extends TSProjectQuestionCollection<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link TSGeneratorQuestionCollection `TSGeneratorQuestionCollection<TSettings, TOptions>`} class.
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
     */
    protected override get ModuleNameQuestion(): Question<TSettings>
    {
        return new TSGeneratorModuleNameQuestion(this.Generator);
    }

    /**
     * @inheritdoc
     */
    protected override get DescriptionQuestion(): Question<TSettings>
    {
        return new TSGeneratorDescriptionQuestion(this.Generator);
    }
}
