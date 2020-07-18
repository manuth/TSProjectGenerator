import { ProjectType } from "../ProjectType";
import { AppGeneratorSettingKey } from "./AppGeneratorSettingKey";

/**
 * Provides settings for the `AppGenerator`.
 */
export interface IAppGeneratorSettings
{
    /**
     * Gets the project-type to create.
     */
    [AppGeneratorSettingKey.ProjectType]: ProjectType;
}
