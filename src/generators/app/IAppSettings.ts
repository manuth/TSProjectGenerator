import { IGeneratorSettings } from "../../IGeneratorSettings";
import { AppSetting } from "./AppSetting";
import { ISubGenerator } from "./ISubGenerator";
import { LintMode } from "./LintMode";

/**
 * Provides settings for the `AppGenerator`.
 */
export interface IAppSettings extends IGeneratorSettings
{
    /**
     * Gets or sets the name.
     */
    [AppSetting.DisplayName]: string;

    /**
     * Gets or sets the module-name.
     */
    [AppSetting.Name]: string;

    /**
     * Gets or sets the description.
     */
    [AppSetting.Description]: string;

    /**
     * Gets or sets the destination.
     */
    [AppSetting.Destination]: string;

    /**
     * Gets or sets the lint-mode.
     */
    [AppSetting.LintMode]: LintMode;

    /**
     * Gets or sets the sub-generator.
     */
    [AppSetting.SubGenerator]: ISubGenerator;
}