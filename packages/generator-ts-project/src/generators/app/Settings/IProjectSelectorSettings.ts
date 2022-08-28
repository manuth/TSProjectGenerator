import { IGeneratorSettings } from "@manuth/extended-yo-generator";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ProjectTypeSelector } from "../ProjectTypeSelector.js";
import { ProjectSelectorSettingKey } from "./ProjectSelectorSettingKey.js";

/**
 * Provides settings for the {@link ProjectTypeSelector `ProjectTypeSelector<T>`}.
 *
 * @template T
 * The type of the project-names.
 */
export interface IProjectSelectorSettings<T extends string | number> extends IGeneratorSettings
{
    /**
     * Gets the project-type to create.
     */
    [ProjectSelectorSettingKey.ProjectType]: T;
}
