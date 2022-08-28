import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings.js";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { TSGeneratorGenerator } from "../TSGeneratorGenerator.js";
import { ISubGenerator } from "./ISubGenerator.js";
import { TSGeneratorSettingKey } from "./TSGeneratorSettingKey.js";

/**
 * Provides settings for the {@link TSGeneratorGenerator `TSGeneratorGenerator<TSettings, TOptions>`}.
 */
export interface ITSGeneratorSettings extends ITSProjectSettings
{
    /**
     * Gets or sets the sub-generator-settings.
     */
    [TSGeneratorSettingKey.SubGenerators]: ISubGenerator[];
}
