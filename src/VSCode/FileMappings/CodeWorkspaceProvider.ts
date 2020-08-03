import { IGeneratorSettings, IGenerator } from "@manuth/extended-yo-generator";
import JSON = require("comment-json");
import { CodeWorkspaceComponent } from "../Components/CodeWorkspaceComponent";
import { IExtensionFile } from "../IExtensionFile";
import { ILaunchFile } from "../ILaunchFile";
import { ITaskFile } from "../ITaskFile";

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
     * Gets the meta-data of the extensions.
     */
    public abstract get ExtensionsMetadata(): Promise<IExtensionFile>;

    /**
     * Gets the meta-data of the debug-settings.
     */
    public abstract get LaunchMetadata(): Promise<ILaunchFile>;

    /**
     * Gets the meta-data of the settings.
     */
    public abstract get SettingsMetadata(): Promise<Record<string, any>>;

    /**
     * Gets the meta-data of the tasks.
     */
    public abstract get TasksMetadata(): Promise<ITaskFile>;

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
        return JSON.parse(this.Generator.fs.read(path));
    }
}
