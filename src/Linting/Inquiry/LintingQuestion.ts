import { IGenerator } from "@manuth/extended-yo-generator";
import { ListQuestionOptions, ChoiceCollection } from "inquirer";
import { QuestionBase } from "../../Components/Inquiry/QuestionBase";
import { ITSProjectSettings } from "../../Project/Settings/ITSProjectSettings";
import { TSProjectSettingKey } from "../../Project/Settings/TSProjectSettingKey";
import { LintRuleset } from "../LintRuleset";

/**
 * Provides a question for asking for the linting-ruleset.
 */
export class LintingQuestion<T extends ITSProjectSettings> extends QuestionBase<T> implements ListQuestionOptions<T>
{
    /**
     * @inheritdoc
     */
    public type = "list" as const;

    /**
     * @inheritdoc
     */
    public name = TSProjectSettingKey.LintRuleset;

    /**
     * Initializes a new instance of the `LintingQuestion<T>` class.
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
     * The message to show to the user.
     */
    public async message(answers: T): Promise<string>
    {
        return "What ruleset do you want to use for linting?";
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
    public default = async (answers: T): Promise<LintRuleset> =>
    {
        return LintRuleset.Recommended;
    };

    /**
     * @inheritdoc
     *
     * @param answers
     * The answers provided by the user.
     *
     * @returns
     * The choices the user can choose from.
     */
    public async choices(answers: T): Promise<ChoiceCollection<T>>
    {
        return [
            {
                value: LintRuleset.Weak,
                name: "manuth's weak ruleset"
            },
            {
                value: LintRuleset.Recommended,
                name: "manuth's recommended ruleset"
            }
        ];
    }
}
