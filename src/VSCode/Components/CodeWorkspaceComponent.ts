import { IFileMapping, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import JSON = require("comment-json");
import { ComponentBase } from "../../Components/ComponentBase";
import { JSONProcessor } from "../../Components/JSONProcessor";
import { TSProjectComponent } from "../../Project/Settings/TSProjectComponent";
import { ExtensionsProcessor } from "../ExtensionsProcessor";
import { CodeFileMappingCreator } from "../FileMappings/CodeFileMappingCreator";
import { WorkspaceFolderCreator } from "../FileMappings/WorkspaceFolderCreator";
import { IExtensionFile } from "../IExtensionFile";
import { ILaunchFile } from "../ILaunchFile";
import { ITaskFile } from "../ITaskFile";
import { LaunchFileProcessor } from "../LaunchFileProcessor";
import { SettingsProcessor } from "../SettingsProcessor";
import { TasksProcessor } from "../TasksProcessor";

/**
 * Provides a component for creating a vscode-workspace.
 */
export abstract class CodeWorkspaceComponent<T extends IGeneratorSettings> extends ComponentBase<T>
{
    /**
     * Initializes a new instance of the `CodeWorkspaceComponent<T>` class.
     *
     * @param generator
     * The generator of the component.
     */
    public constructor(generator: IGenerator<T>)
    {
        super(generator);
    }

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
     */
    public get FileMappings(): Promise<Array<IFileMapping<T>>>
    {
        return (
            async (): Promise<Array<IFileMapping<T>>> =>
            {
                return this.FileMappingCreator.FileMappings;
            })();
    }

    /**
     * Gets the meta-data of the source extensions.
     */
    public abstract get SourceExtensions(): Promise<IExtensionFile>;

    /**
     * Gets the meta-data of the extensions to write.
     */
    public get ExtensionsMetadata(): Promise<IExtensionFile>
    {
        return (
            async () =>
            {
                return this.ExtensionsProcessor.Process(await this.SourceExtensions);
            })();
    }

    /**
     * Gets the meta-data of the source debug settings.
     */
    public abstract get SourceDebugSettings(): Promise<ILaunchFile>;

    /**
     * Gets the meta-data of the debug-settings to write.
     */
    public get LaunchMetadata(): Promise<ILaunchFile>
    {
        return (
            async () =>
            {
                return this.LaunchFileProcessor.Process(await this.SourceDebugSettings);
            })();
    }

    /**
     * Gets the meta-data of the source settings.
     */
    public abstract get SourceSettings(): Promise<Record<string, any>>;

    /**
     * Gets the metadata of the settings to write.
     */
    public get SettingsMetadata(): Promise<Record<string, any>>
    {
        return (
            async () =>
            {
                return this.SettingsProcessor.Process(await this.SourceSettings);
            })();
    }

    /**
     * Gets the meta-data of the source tasks.
     */
    public abstract get SourceTasks(): Promise<ITaskFile>;

    /**
     * Gets the metadata of the tasks to write.
     */
    public get TasksMetadata(): Promise<ITaskFile>
    {
        return (
            async () =>
            {
                return this.TasksProcessor.Process(await this.SourceTasks);
            })();
    }

    /**
     * Gets a component for processing the extensions.
     */
    protected get ExtensionsProcessor(): JSONProcessor<T, IExtensionFile>
    {
        return new ExtensionsProcessor(this);
    }

    /**
     * Gets a component for processing the debug-settings.
     */
    protected get LaunchFileProcessor(): JSONProcessor<T, ILaunchFile>
    {
        return new LaunchFileProcessor(this);
    }

    /**
     * Gets a component for processing the settings.
     */
    protected get SettingsProcessor(): JSONProcessor<T, Record<string, any>>
    {
        return new SettingsProcessor(this);
    }

    /**
     * Gets a component for processing tasks.
     */
    protected get TasksProcessor(): JSONProcessor<T, ITaskFile>
    {
        return new TasksProcessor(this);
    }

    /**
     * Gets a component for creating file-mappings.
     */
    protected get FileMappingCreator(): CodeFileMappingCreator<T>
    {
        return new WorkspaceFolderCreator(this);
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
        return JSON.parse(this.Generator.fs.read(path));
    }
}
