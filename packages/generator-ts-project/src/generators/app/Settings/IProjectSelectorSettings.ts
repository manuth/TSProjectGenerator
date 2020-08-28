import { IGeneratorSettings } from "@manuth/extended-yo-generator";
import { ProjectSelectorSettingKey } from "./ProjectSelectorSettingKey";

/**
 * Provides settings for the `AppGenerator`.
 */
export interface IProjectSelectorSettings<T extends string | number> extends IGeneratorSettings
{
    /**
     * Gets the project-type to create.
     */
    [ProjectSelectorSettingKey.ProjectType]: T;
}
