import { Question, IGenerator } from "@manuth/extended-yo-generator";
import { ITSProjectSettings } from "../Settings/ITSProjectSettings";
import { TSProjectDescriptionQuestion } from "./TSProjectDescriptionQuestion";
import { TSProjectDestinationQuestion } from "./TSProjectDestinationQuestion";
import { TSProjectDisplayNameQuestion } from "./TSProjectDisplayNameQuestion";
import { TSProjectModuleNameQuestion } from "./TSProjectModuleNameQuestion";

/**
 * Provides questions for asking for the `TSProject`-creation.
 */
export class TSProjectQuestionCollection<T extends ITSProjectSettings>
{
    /**
     * The generator of the question-collection.
     */
    private generator: IGenerator<T>;

    /**
     * Initializes a new instance of the `TSProjectQuestionCollection<T>` class.
     *
     * @param generator
     * The generator of the question-collection.
     */
    public constructor(generator: IGenerator<T>)
    {
        this.generator = generator;
    }

    /**
     * Gets the generator of the question-collection.
     */
    protected get Generator(): IGenerator<T>
    {
        return this.generator;
    }

    /**
     * Gets a question to ask for the destination to write the project to.
     */
    protected get DestinationQuestion(): Question<T>
    {
        return new TSProjectDestinationQuestion(this.Generator);
    }

    /**
     * Gets a question to ask for the display-name of the project.
     */
    protected get DisplayNameQuestion(): Question<T>
    {
        return new TSProjectDisplayNameQuestion(this.Generator);
    }

    /**
     * Gets a question to ask for the name of the module.
     */
    protected get ModuleNameQuestion(): Question<T>
    {
        return new TSProjectModuleNameQuestion(this.Generator);
    }

    /**
     * Gets a question to ask for the description.
     */
    protected get DescriptionQuestion(): Question<T>
    {
        return new TSProjectDescriptionQuestion(this.Generator);
    }

    /**
     * Gets the questions of the project.
     */
    public get Questions(): Array<Question<T>>
    {
        return [
            this.DestinationQuestion,
            this.DisplayNameQuestion,
            this.ModuleNameQuestion,
            this.DescriptionQuestion
        ];
    }
}
