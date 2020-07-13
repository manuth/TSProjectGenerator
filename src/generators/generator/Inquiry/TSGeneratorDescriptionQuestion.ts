import { ProjectDescriptionQuestion } from "../../../Project/Inquiry/ProjectDescriptionQuestion";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";

/**
 * Provides a question for asking for description of a generator.
 */
export class TSGeneratorDescriptionQuestion<T extends ITSProjectSettings> extends ProjectDescriptionQuestion<T>
{
    /**
     * Initializes a new instance of the `TSGeneratorDescriptionQuestion<T>` class.
     */
    public constructor()
    {
        super();
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
    public async message(answers: T): Promise<string>
    {
        return "Please enter a description for your generator.";
    }
}
