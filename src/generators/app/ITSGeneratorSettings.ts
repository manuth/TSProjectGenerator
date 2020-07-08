import { IGeneratorSettings } from "extended-yo-generator";
import { LintRuleset } from "../../Linting/LintRuleset";
import { ISubGenerator } from "./ISubGenerator";
import { TSGeneratorSettingKey } from "./TSGeneratorSetting";

/**
 * Provides settings for the `AppGenerator`.
 */
export interface ITSGeneratorSettings extends IGeneratorSettings
{
    /**
     * Gets or sets the name.
     */
    [TSGeneratorSettingKey.DisplayName]: string;

    /**
     * Gets or sets the module-name.
     */
    [TSGeneratorSettingKey.Name]: string;

    /**
     * Gets or sets the description.
     */
    [TSGeneratorSettingKey.Description]: string;

    /**
     * Gets or sets the destination.
     */
    [TSGeneratorSettingKey.Destination]: string;

    /**
     * Gets or sets the lint-ruleset.
     */
    [TSGeneratorSettingKey.LintRuleset]: LintRuleset;

    /**
     * Gets or sets the sub-generator.
     */
    [TSGeneratorSettingKey.SubGenerator]: ISubGenerator;
}
