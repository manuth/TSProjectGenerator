import { Question } from "@manuth/extended-yo-generator";
import { TSProjectQuestionCollection } from "../../../Project/Inquiry/TSProjectQuestionCollection";
import { ITSGeneratorSettings } from "../Settings/ITSGeneratorSettings";
import { TSGeneratorDescriptionQuestion } from "./TSGeneratorDescriptionQuestion";
import { TSGeneratorModuleNameQuestion } from "./TSGeneratorModuleNameQuestion";

/**
 * Provides questions for asking for the `TSGenerator`-creation.
 */
export class TSGeneratorQuestionCollection<T extends ITSGeneratorSettings> extends TSProjectQuestionCollection<T>
{
    /**
     * Initializes a new instance of the `TSGeneratorQuestionCollection<T>` class.
     */
    public constructor()
    {
        super();
    }

    /**
     * @inheritdoc
     */
    protected get ModuleNameQuestion(): Question<T>
    {
        return new TSGeneratorModuleNameQuestion();
    }

    /**
     * @inheritdoc
     */
    protected get DescriptionQuestion(): Question<T>
    {
        return new TSGeneratorDescriptionQuestion();
    }
}
