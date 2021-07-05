import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { TSGeneratorGenerator } from "../TSGeneratorGenerator";
import { ISubGenerator } from "./ISubGenerator";
import { TSGeneratorSettingKey } from "./TSGeneratorSettingKey";

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
