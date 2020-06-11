import { SubGeneratorSetting } from "./SubGeneratorSetting";

/**
 * Represents a sub-generator.
 */
export interface ISubGenerator
{
    /**
     * Gets or sets the name.
     */
    [SubGeneratorSetting.Name]: string;

    /**
     * Gets or sets the disaplay-name.
     */
    [SubGeneratorSetting.DisplayName]: string;
}
