import { GeneratorOptions, IGenerator, Question } from "@manuth/extended-yo-generator";
import { TSProjectQuestionCollection } from "../../../Project/Inquiry/TSProjectQuestionCollection";
import { ITSGeneratorSettings } from "../Settings/ITSGeneratorSettings";
import { TSGeneratorDescriptionQuestion } from "./TSGeneratorDescriptionQuestion";
import { TSGeneratorModuleNameQuestion } from "./TSGeneratorModuleNameQuestion";

/**
 * Provides questions for asking for the `TSGenerator`-creation.
 */
export class TSGeneratorQuestionCollection<TSettings extends ITSGeneratorSettings, TOptions extends GeneratorOptions> extends TSProjectQuestionCollection<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the `TSGeneratorQuestionCollection` class.
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
