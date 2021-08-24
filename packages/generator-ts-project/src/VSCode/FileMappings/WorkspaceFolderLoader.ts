import { GeneratorOptions, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { CodeWorkspaceComponent } from "../Components/CodeWorkspaceComponent";
import { IWorkspaceMetadata } from "../IWorkspaceMetadata";
import { CodeWorkspaceProvider } from "./CodeWorkspaceProvider";

/**
 * Provides the functionality to load workspace-settings from a folder.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class WorkspaceFolderLoader<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends CodeWorkspaceProvider<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link WorkspaceFolderLoader `WorkspaceFolderLoader<TSettings, TOptions>`} class.
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
     * Gets the name of the file containing extensions.
     */
    public get ExtensionsFileName(): string
    {
        return this.SettingsPath("extensions.json");
    }

    /**
     * Gets the name of the file containing the launch-settings.
     */
    public get LaunchFileName(): string
    {
        return this.SettingsPath("launch.json");
    }

    /**
     * Gets the name of the file containing settings.
     */
    public get SettingsFileName(): string
    {
        return this.SettingsPath("settings.json");
    }

    /**
     * Gets the name of the file containing the tasks.
     */
    public get TasksFileName(): string
    {
        return this.SettingsPath("tasks.json");
    }

    /**
     * @inheritdoc
     *
     * @returns
     * The meta-data of the workspace.
     */
    public async GetWorkspaceMetadata(): Promise<IWorkspaceMetadata>
    {
        return {
            folders: [],
            extensions: await this.ReadJSON(this.ExtensionsFileName),
            launch: await this.ReadJSON(this.LaunchFileName),
            settings: await this.ReadJSON(this.SettingsFileName),
            tasks: await this.ReadJSON(this.TasksFileName)
        };
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
    protected SettingsPath(...path: string[]): string
    {
        return this.Generator.modulePath(this.SettingsFolderName, ...path);
    }
}
