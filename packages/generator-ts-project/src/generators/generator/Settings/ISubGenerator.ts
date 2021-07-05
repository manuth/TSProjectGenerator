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
     * Gets or sets the human-readable name of the generator.
     */
    [SubGeneratorSettingKey.DisplayName]: string;
}
