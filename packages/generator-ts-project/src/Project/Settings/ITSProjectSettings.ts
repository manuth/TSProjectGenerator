import { IGeneratorSettings } from "@manuth/extended-yo-generator";
import { LintRuleset } from "../../Linting/LintRuleset";
import { TSProjectSettingKey } from "./TSProjectSettingKey";

/**
 * Provides settings for project-generators.
 */
export interface ITSProjectSettings extends IGeneratorSettings
{
    /**
     * Gets or sets the path to save the project to.
     */
    [TSProjectSettingKey.Destination]: string;

    /**
     * Gets or sets the human-readable name.
     */
    [TSProjectSettingKey.DisplayName]: string;

    /**
     * Gets or sets the name of the project.
     */
    [TSProjectSettingKey.Name]: string;

    /**
     * Gets or sets the description of the project.
     */
    [TSProjectSettingKey.Description]: string;

    /**
     * Gets or sets the ruleset of the project.
     */
    [TSProjectSettingKey.LintRuleset]: LintRuleset;
}
