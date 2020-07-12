import { IFileMapping, Component, IGenerator } from "@manuth/extended-yo-generator";
import { VSCodeExtensionsMapping } from "../FileMappings/VSCode/VSCodeExtensionsMapping";
import { VSCodeLaunchFileMapping } from "../FileMappings/VSCode/VSCodeLaunchFileMapping";
import { VSCodeSettingsFileMapping } from "../FileMappings/VSCode/VSCodeSettingsFileMapping";
import { VSCodeTasksFileMapping } from "../FileMappings/VSCode/VSCodeTasksFileMapping";
import { ITSProjectSettings } from "../ITSProjectSettings";
import { TSProjectComponent } from "../TSProjectComponent";
import { ProjectComponent } from "./ProjectComponent";

/**
 * Provides a component for creating a vscode-workspace.
 */
export class CodeWorkspaceComponent<T extends ITSProjectSettings> extends ProjectComponent<T>
{
    /**
     * @inheritdoc
     */
    public get ID(): string
    {
        return TSProjectComponent.VSCode;
    }

    /**
     * @inheritdoc
     */
    public get DisplayName(): string
    {
        return "Visual Studio Code Workspace";
    }

    /**
     * @inheritdoc
     */
    public get DefaultEnabled(): boolean
    {
        return true;
    }

    /**
     * @inheritdoc
     *
     * @param component
     * The resolved representation of this component.
     *
     * @param generator
     * The generator of this component
     *
     * @returns
     * The file-mappings of this component.
     */
    public async FileMappings(component: Component<T>, generator: IGenerator<T>): Promise<Array<IFileMapping<T>>>
    {
        let settingsFolderName = await this.GetSettingsFolderName(component, generator);

        return [
            {
                Source: generator.modulePath(settingsFolderName),
                Destination: settingsFolderName
            },
            await this.GetExtensionsFileMapping(settingsFolderName, component, generator),
            await this.GetLaunchFileMapping(settingsFolderName, component, generator),
            await this.GetSettingsFileMapping(settingsFolderName, component, generator),
            await this.GetTaskFileMapping(settingsFolderName, component, generator)
        ];
    }

    /**
     * Gets the name of the folder which contains the settings (such as `.vscode`, `.vscode-insiders` or `.vscodium`).
     *
     * @param component
     * The resolved representation of this component.
     *
     * @param generator
     * The generator of this component
     *
     * @returns
     * The name of the folder which contains the settings (such as `.vscode`, `.vscode-insiders` or `.vscodium`).
     */
    protected async GetSettingsFolderName(component: Component<T>, generator: IGenerator<T>): Promise<string>
    {
        return ".vscode";
    }

    /**
     * Gets a file-mapping for creating the `extensions.js` file.
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
        return new VSCodeExtensionsMapping(settingsFolderName);
    }

    /**
     * Gets a file-mapping for creating the `launch.json` file.
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
        return new VSCodeLaunchFileMapping(settingsFolderName);
    }

    /**
     * Gets a file-mapping for creating the `settings.json` file.
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
        return new VSCodeSettingsFileMapping(settingsFolderName);
    }

    /**
     * Gets a file-mapping for creating the `tasks.json` file.
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
        return new VSCodeTasksFileMapping(settingsFolderName);
    }
}
