import { IGeneratorSettings } from "@manuth/extended-yo-generator";
import { CodeWorkspaceComponent } from "../Components/CodeWorkspaceComponent";
import { IExtensionFile } from "../IExtensionFile";
import { ILaunchFile } from "../ILaunchFile";
import { ITaskFile } from "../ITaskFile";
import { CodeWorkspaceProvider } from "./CodeWorkspaceProvider";

/**
 * Provides the functionality to load workspace-settings from a folder.
 */
export class WorkspaceFolderLoader<T extends IGeneratorSettings> extends CodeWorkspaceProvider<T>
{
    /**
     * Initializes a new instance of the `WorkspaceFolderLoader` class.
     *
     * @param component
     * The component of the file-mapping creator.
     */
    public constructor(component: CodeWorkspaceComponent<T>)
    {
        super(component);
    }

    /**
     * Gets the name of the folder which contains the settings (such as `.vscode`, `.vscode-insiders` or `.vscodium`).
     */
    public get SettingsFolderName(): string
    {
        return ".vscode";
    }

    /**
     * Creates a path relative to the settings folder.
     *
     * @param path
     * The path to join.
     *
     * @returns
     * The path relative to the settings folder.
     */
    protected async SettingsPath(...path: string[]): Promise<string>
    {
        return this.Generator.modulePath(this.SettingsFolderName, ...path);
    }

    /**
     * Gets the name of the file containing extensions.
     */
    public get ExtensionsFileName(): Promise<string>
    {
        return this.SettingsPath("extensions.json");
    }

    /**
     * @inheritdoc
     */
    public get ExtensionsMetadata(): Promise<IExtensionFile>
    {
        return (
            async () =>
            {
                return this.ReadJSON(await this.ExtensionsFileName);
            })();
    }

    /**
     * Gets the name of the file containing the launch-settings.
     */
    public get LaunchFileName(): Promise<string>
    {
        return this.SettingsPath("launch.json");
    }

    /**
     * @inheritdoc
     */
    public get LaunchMetadata(): Promise<ILaunchFile>
    {
        return (
            async () =>
            {
                return this.ReadJSON(await this.LaunchFileName);
            })();
    }

    /**
     * Gets the name of the file containing settings.
     */
    public get SettingsFileName(): Promise<string>
    {
        return this.SettingsPath("settings.json");
    }

    /**
     * @inheritdoc
     */
    public get SettingsMetadata(): Promise<Record<string, any>>
    {
        return (
            async () =>
            {
                return this.ReadJSON(await this.SettingsFileName);
            })();
    }

    /**
     * Gets the name of the file containing the tasks.
     */
    public get TasksFileName(): Promise<string>
    {
        return this.SettingsPath("tasks.json");
    }

    /**
     * @inheritdoc
     */
    public get TasksMetadata(): Promise<ITaskFile>
    {
        return (
            async () =>
            {
                return this.ReadJSON(await this.TasksFileName);
            })();
    }
}
