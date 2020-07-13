import { Component, IGenerator, IFileMapping } from "@manuth/extended-yo-generator";
import { CodeWorkspaceComponent } from "../../VSCode/Components/CodeWorkspaceComponent";
import { TSProjectExtensionsMapping } from "../FileMappings/VSCode/TSProjectExtensionsMapping";
import { TSProjectLaunchFileMapping } from "../FileMappings/VSCode/TSProjectLaunchFileMapping";
import { TSProjectSettingsFileMapping } from "../FileMappings/VSCode/TSProjectSettingsFileMapping";
import { TSProjectTasksFileMapping } from "../FileMappings/VSCode/TSProjectTasksFileMapping";
import { ITSProjectSettings } from "../Settings/ITSProjectSettings";

/**
 * Provides a component for creating a vscode-workspace for `TSProject`s.
 */
export class TSProjectCodeWorkspaceComponent<T extends ITSProjectSettings> extends CodeWorkspaceComponent<T>
{
    /**
     * Initializes a new isntance of the `TSProjectCodeWorkspaceComponent<T>` class.
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
        return new TSProjectExtensionsMapping(settingsFolderName);
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
        return new TSProjectLaunchFileMapping(settingsFolderName);
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
        return new TSProjectSettingsFileMapping(settingsFolderName);
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
        return new TSProjectTasksFileMapping(settingsFolderName);
    }
}
