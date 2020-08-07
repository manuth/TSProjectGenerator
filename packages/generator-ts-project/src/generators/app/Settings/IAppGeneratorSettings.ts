import { IGeneratorSettings } from "@manuth/extended-yo-generator";
import { ProjectType } from "../ProjectType";
import { AppGeneratorSettingKey } from "./AppGeneratorSettingKey";

/**
 * Provides settings for the `AppGenerator`.
 */
export interface IAppGeneratorSettings extends IGeneratorSettings
{
    /**
     * Gets the project-type to create.
     */
    [AppGeneratorSettingKey.ProjectType]: ProjectType;
}
