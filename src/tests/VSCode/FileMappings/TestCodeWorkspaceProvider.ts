import { IGeneratorSettings } from "@manuth/extended-yo-generator";
import { CodeWorkspaceComponent } from "../../../VSCode/Components/CodeWorkspaceComponent";
import { CodeWorkspaceProvider } from "../../../VSCode/FileMappings/CodeWorkspaceProvider";
import { IExtensionFile } from "../../../VSCode/IExtensionFile";
import { ILaunchFile } from "../../../VSCode/ILaunchFile";
import { ITaskFile } from "../../../VSCode/ITaskFile";

/**
 * Provides an implementation of the `CodeWorkspaceProvider` class for testing.
 */
export class TestCodeWorkspaceProvider<T extends IGeneratorSettings> extends CodeWorkspaceProvider<T>
{
    /**
     * The meta-data of the source extensions.
     */
    private extensions: Promise<IExtensionFile> = null;

    /**
     * The meta-data of the source debug-settings.
     */
    private launchMetadata: Promise<ILaunchFile> = null;

    /**
     * The metadata of the source settings.
     */
    private settings: Promise<Record<string, any>> = null;

    /**
     * The meta-data of the source tasks.
     */
    private tasks: Promise<ITaskFile> = null;

    /**
     * Initializes a new instance of the `TestCodeWorkspaceProvider` class.
     *
     * @param component
     * The component of this code-workspace provider.
     */
    public constructor(component: CodeWorkspaceComponent<T>)
    {
        super(component);
    }

    /**
     * Gets or sets the meta-data of the extensions.
     */
    public get ExtensionsMetadata(): Promise<IExtensionFile>
    {
        return this.extensions;
    }

    /**
     * @inheritdoc
     */
    public set ExtensionsMetadata(value: Promise<IExtensionFile>)
    {
        this.extensions = value;
    }

    /**
     * Gets or sets the meta-data of the debug-settings.
     */
    public get LaunchMetadata(): Promise<ILaunchFile>
    {
        return this.launchMetadata;
    }

    /**
     * @inheritdoc
     */
    public set SourceDebugSettings(value: Promise<ILaunchFile>)
    {
        this.launchMetadata = value;
    }

    /**
     * Gets or sets the metadata of the settings.
     */
    public get SettingsMetadata(): Promise<Record<string, any>>
    {
        return this.settings;
    }

    /**
     * @inheritdoc
     */
    public set SettingsMetadata(value: Promise<Record<string, any>>)
    {
        this.settings = value;
    }

    /**
     * Gets or sets the meta-data of the source tasks.
     */
    public get TasksMetadata(): Promise<ITaskFile>
    {
        return this.tasks;
    }

    /**
     * @inheritdoc
     */
    public set TasksMetadata(value: Promise<ITaskFile>)
    {
        this.tasks = value;
    }

    /**
     * @inheritdoc
     *
     * @param path
     * The path to the JSON file to read.
     *
     * @returns
     * The JSON read from the `path`.
     */
    public async ReadJSON(path: string): Promise<any>
    {
        return super.ReadJSON(path);
    }
}
