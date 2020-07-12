import { ITSProjectSettings } from "../../../Project/ITSProjectSettings";
import { ISubGenerator } from "./ISubGenerator";
import { TSGeneratorSettingKey } from "./TSGeneratorSettingKey";

/**
 * Provides settings for the `AppGenerator`.
 */
export interface ITSGeneratorSettings extends ITSProjectSettings
{
    /**
     * Gets or sets the sub-generator.
     */
    [TSGeneratorSettingKey.SubGenerator]: ISubGenerator[];
}
