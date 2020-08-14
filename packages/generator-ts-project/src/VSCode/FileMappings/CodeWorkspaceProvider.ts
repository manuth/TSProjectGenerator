import { IGeneratorSettings, IGenerator } from "@manuth/extended-yo-generator";
import JSON = require("comment-json");
import { readFile } from "fs-extra";
import { CodeWorkspaceComponent } from "../Components/CodeWorkspaceComponent";
import { IExtensionFile } from "../IExtensionFile";
import { ILaunchFile } from "../ILaunchFile";
import { ITaskFile } from "../ITaskFile";
import { IWorkspaceMetadata } from "../IWorkspaceMetadata";

/**
 * Provides the functionality to load a vscode-workspace.
 */
export abstract class CodeWorkspaceProvider<T extends IGeneratorSettings>
{
    /**
     * The component of the file-mapping creator.
     */
    private component: CodeWorkspaceComponent<T>;

    /**
     * Initializes a new instance of the `CodeWorkspaceProvider` class.
     *
     * @param component
     * The component of this code-workspace provider.
     */
    public constructor(component: CodeWorkspaceComponent<T>)
    {
        this.component = component;
    }

    /**
     * Gets the component of this code-workspace provider.
     */
    public get Component(): CodeWorkspaceComponent<T>
    {
        return this.component;
    }

    /**
     * Gets the generator of this code-workspace provider.
     */
    public get Generator(): IGenerator<T>
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
    public get ExtensionsMetadata(): Promise<IExtensionFile>
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
    public get LaunchMetadata(): Promise<ILaunchFile>
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
    public get TasksMetadata(): Promise<ITaskFile>
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
