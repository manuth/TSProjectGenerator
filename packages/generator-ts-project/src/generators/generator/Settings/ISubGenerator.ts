import { SubGeneratorSettingKey } from "./SubGeneratorSettingKey";

/**
 * Represents a sub-generator.
 */
export interface ISubGenerator
{
    /**
     * Gets or sets the name.
     */
    [SubGeneratorSettingKey.Name]: string;

    /**
     * Gets or sets the disaplay-name.
     */
    [SubGeneratorSettingKey.DisplayName]: string;
}
