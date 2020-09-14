import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import JSON = require("comment-json");
import { readFile } from "fs-extra";
import { CodeWorkspaceComponent } from "../Components/CodeWorkspaceComponent";
import { IExtensionSettings } from "../IExtensionSettings";
import { ILaunchSettings } from "../ILaunchSettings";
import { ITaskSettings } from "../ITaskSettings";
import { IWorkspaceMetadata } from "../IWorkspaceMetadata";

/**
 * Provides the functionality to load a vscode-workspace.
 */
export abstract class CodeWorkspaceProvider<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions>
{
    /**
     * The component of the file-mapping creator.
     */
    private component: CodeWorkspaceComponent<TSettings, TOptions>;

    /**
     * Initializes a new instance of the `CodeWorkspaceProvider` class.
     *
     * @param component
     * The component of this code-workspace provider.
     */
    public constructor(component: CodeWorkspaceComponent<TSettings, TOptions>)
    {
        this.component = component;
    }

    /**
     * Gets the component of this code-workspace provider.
     */
    public get Component(): CodeWorkspaceComponent<TSettings, TOptions>
    {
        return this.component;
    }

    /**
     * Gets the generator of this code-workspace provider.
     */
    public get Generator(): IGenerator<TSettings, TOptions>
    {
        return this.Component.Generator;
    }

    /**
     * Gets the meta-data of the workspace.
     */
    public abstract get WorkspaceMetadata(): Promise<IWorkspaceMetadata>;

    /**
     * Gets the meta-data of the extensions.
     */
    public get ExtensionsMetadata(): Promise<IExtensionSettings>
    {
        return (
            async () =>
            {
                return (await this.WorkspaceMetadata).extensions;
            })();
    }

    /**
     * Gets the meta-data of the debug-settings.
     */
    public get LaunchMetadata(): Promise<ILaunchSettings>
    {
        return (
            async () =>
            {
                return (await this.WorkspaceMetadata).launch;
            })();
    }

    /**
     * Gets the meta-data of the settings.
     */
    public get SettingsMetadata(): Promise<Record<string, any>>
    {
        return (
            async () =>
            {
                return (await this.WorkspaceMetadata).settings;
            })();
    }

    /**
     * Gets the meta-data of the tasks.
     */
    public get TasksMetadata(): Promise<ITaskSettings>
    {
        return (
            async () =>
            {
                return (await this.WorkspaceMetadata).tasks;
            })();
    }

    /**
     * Reads json from the specified `path`.
     *
     * @param path
     * The path to the JSON file to read.
     *
     * @returns
     * The JSON read from the `path`.
     */
    protected async ReadJSON(path: string): Promise<any>
    {
        return JSON.parse((await readFile(path)).toString());
    }
}
