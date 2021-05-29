import { GeneratorOptions, IGenerator } from "@manuth/extended-yo-generator";
import { TSProjectDescriptionQuestion } from "../../../Project/Inquiry/TSProjectDescriptionQuestion";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";

/**
 * Provides a question for asking for description of a generator.
 */
export class TSGeneratorDescriptionQuestion<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends TSProjectDescriptionQuestion<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the `TSGeneratorDescriptionQuestion` class.
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
    public override async Message(answers: TSettings): Promise<string>
    {
        return "Please enter a description for your generator.";
    }
}
