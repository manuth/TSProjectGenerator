import { IGenerator } from "@manuth/extended-yo-generator";
import { TSProjectDescriptionQuestion } from "../../../Project/Inquiry/TSProjectDescriptionQuestion";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";

/**
 * Provides a question for asking for description of a generator.
 */
export class TSGeneratorDescriptionQuestion<T extends ITSProjectSettings> extends TSProjectDescriptionQuestion<T>
{
    /**
     * Initializes a new instance of the `TSGeneratorDescriptionQuestion<T>` class.
     *
     * @param generator
     * The generator of the question.
     */
    public constructor(generator: IGenerator<T>)
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
    public message = async (answers: T): Promise<string> =>
    {
        return "Please enter a description for your generator.";
    };
}
