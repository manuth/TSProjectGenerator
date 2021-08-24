import { GeneratorOptions, IGenerator, QuestionBase } from "@manuth/extended-yo-generator";
import { ChoiceCollection, ListQuestionOptions } from "inquirer";
import { ITSProjectSettings } from "../../Project/Settings/ITSProjectSettings";
import { TSProjectSettingKey } from "../../Project/Settings/TSProjectSettingKey";
import { LintRuleset } from "../LintRuleset";

/**
 * Provides a question for asking for the linting-ruleset.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class LintingQuestion<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends QuestionBase<TSettings, TOptions> implements ListQuestionOptions<TSettings>
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
     * Initializes a new instance of the {@link LintingQuestion `LintingQuestion<TSettings, TOptions>`} class.
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
     * The message to show to the user.
     */
    public async Message(answers: TSettings): Promise<string>
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
    public override async Default(answers: TSettings): Promise<LintRuleset>
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
    public override async Choices(answers: TSettings): Promise<ChoiceCollection<TSettings>>
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
