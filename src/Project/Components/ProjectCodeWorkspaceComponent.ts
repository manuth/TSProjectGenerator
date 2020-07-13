import { Component, IGenerator, IFileMapping } from "@manuth/extended-yo-generator";
import { CodeWorkspaceComponent } from "../../VSCode/Components/CodeWorkspaceComponent";
import { ProjectExtensionsMapping } from "../FileMappings/VSCode/ProjectExtensionsMapping";
import { ProjectLaunchFileMapping } from "../FileMappings/VSCode/ProjectLaunchFileMapping";
import { ProjectSettingsFileMapping } from "../FileMappings/VSCode/ProjectSettingsFileMapping";
import { ProjectTasksFileMapping } from "../FileMappings/VSCode/ProjectTasksFileMapping";
import { ITSProjectSettings } from "../Settings/ITSProjectSettings";

/**
 * Provides a component for creating a vscode-workspace for `TSProject`s.
 */
export class ProjectCodeWorkspaceComponent<T extends ITSProjectSettings> extends CodeWorkspaceComponent<T>
{
    /**
     * Initializes a new isntance of the `ProjectCodeWorkspaceComponent<T>` class.
     */
    public constructor()
    {
        super();
    }

    /**
     * @inheritdoc
     *
     * @param settingsFolderName
     * The name of the directory which contains vscode-settings.
     *
     * @param component
     * A resolved representation of this component.
     *
     * @param generator
     * The generator of this component.
     *
     * @returns
     * A file-mapping for creating the `extensions.js` file.
     */
    protected async GetExtensionsFileMapping(settingsFolderName: string, component: Component<T>, generator: IGenerator<T>): Promise<IFileMapping<T>>
    {
        return new ProjectExtensionsMapping(settingsFolderName);
    }

    /**
     * @inheritdoc
     *
     * @param settingsFolderName
     * The name of the directory which contains vscode-settings.
     *
     * @param component
     * A resolved representation of this component.
     *
     * @param generator
     * The generator of this component.
     *
     * @returns
     * A file-mapping for creating the `launch.json` file.
     */
    protected async GetLaunchFileMapping(settingsFolderName: string, component: Component<T>, generator: IGenerator<T>): Promise<IFileMapping<T>>
    {
        return new ProjectLaunchFileMapping(settingsFolderName);
    }

    /**
     * @inheritdoc
     *
     * @param settingsFolderName
     * The name of the directory which contains vscode-settings.
     *
     * @param component
     * A resolved representation of this component.
     *
     * @param generator
     * The generator of this component.
     *
     * @returns
     * A file-mapping for creating the `settings.json` file.
     */
    protected async GetSettingsFileMapping(settingsFolderName: string, component: Component<T>, generator: IGenerator<T>): Promise<IFileMapping<T>>
    {
        return new ProjectSettingsFileMapping(settingsFolderName);
    }

    /**
     * @inheritdoc
     *
     * @param settingsFolderName
     * The name of the directory which contains vscode-settings.
     *
     * @param component
     * A resolved representation of this component.
     *
     * @param generator
     * The generator of this component.
     *
     * @returns
     * A file-mapping for creating the `tasks.json` file.
     */
    protected async GetTaskFileMapping(settingsFolderName: string, component: Component<T>, generator: IGenerator<T>): Promise<IFileMapping<T>>
    {
        return new ProjectTasksFileMapping(settingsFolderName);
    }
}
