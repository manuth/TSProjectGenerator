import { GeneratorOptions, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { CodeWorkspaceComponent } from "../Components/CodeWorkspaceComponent";
import { IWorkspaceMetadata } from "../IWorkspaceMetadata";
import { CodeWorkspaceProvider } from "./CodeWorkspaceProvider";

/**
 * Provides the functionality to load workspace-settings from a folder.
 */
export class WorkspaceFolderLoader<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends CodeWorkspaceProvider<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the `WorkspaceFolderLoader` class.
     *
     * @param component
     * The component of the file-mapping creator.
     */
    public constructor(component: CodeWorkspaceComponent<TSettings, TOptions>)
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
    public get WorkspaceMetadata(): Promise<IWorkspaceMetadata>
    {
        return (
            async (): Promise<IWorkspaceMetadata> =>
            {
                return {
                    folders: [],
                    extensions: await this.ReadJSON(await this.ExtensionsFileName),
                    launch: await this.ReadJSON(await this.LaunchFileName),
                    settings: await this.ReadJSON(await this.SettingsFileName),
                    tasks: await this.ReadJSON(await this.TasksFileName)
                };
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
     * Gets the name of the file containing settings.
     */
    public get SettingsFileName(): Promise<string>
    {
        return this.SettingsPath("settings.json");
    }

    /**
     * Gets the name of the file containing the tasks.
     */
    public get TasksFileName(): Promise<string>
    {
        return this.SettingsPath("tasks.json");
    }
}
