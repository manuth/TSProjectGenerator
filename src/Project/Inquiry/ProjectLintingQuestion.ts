import { ListQuestionOptions, ChoiceCollection } from "inquirer";
import { QuestionBase } from "../../Inquiry/QuestionBase";
import { LintRuleset } from "../../Linting/LintRuleset";
import { ITSProjectSettings } from "../ITSProjectSettings";
import { TSProjectSettingKey } from "../TSProjectSettingKey";

/**
 * Provides a question for asking for the linting-ruleset.
 */
export class ProjectLintingQuestion<T extends ITSProjectSettings> extends QuestionBase<T> implements ListQuestionOptions<T>
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
     * Initializes a new instance of the `ProjectLintingQuestion` class.
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
    public async default(answers: T): Promise<LintRuleset>
    {
        return LintRuleset.Recommended;
    }

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
