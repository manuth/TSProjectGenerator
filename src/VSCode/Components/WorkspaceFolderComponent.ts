import { IGeneratorSettings, IGenerator } from "@manuth/extended-yo-generator";
import { IExtensionFile } from "../IExtensionFile";
import { ILaunchFile } from "../ILaunchFile";
import { ITaskFile } from "../ITaskFile";
import { CodeWorkspaceComponent } from "./CodeWorkspaceComponent";

/**
 * Provides a component for creating a code workspace folder.
 */
export class WorkspaceFolderComponent<T extends IGeneratorSettings> extends CodeWorkspaceComponent<T>
{
    /**
     * Initializes a new instance of the `WorkspaceFolderComponent<T>` class.
     *
     * @param generator
     * The generator of the component.
     */
    public constructor(generator: IGenerator<T>)
    {
        super(generator);
    }

    /**
     * Gets the name of the folder which contains the settings (such as `.vscode`, `.vscode-insiders` or `.vscodium`).
     */
    public get SettingsFolderName(): Promise<string>
    {
        return (
            async () =>
            {
                return ".vscode";
            })();
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
    public get SourceExtensions(): Promise<IExtensionFile>
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
    public get SourceDebugSettings(): Promise<ILaunchFile>
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
    public get SourceSettings(): Promise<Record<string, any>>
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
    public get SourceTasks(): Promise<ITaskFile>
    {
        return (
            async () =>
            {
                return this.ReadJSON(await this.TasksFileName);
            })();
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
        return this.Generator.modulePath(await this.SettingsFolderName, ...path);
    }
}
