import { IFileMapping, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { ComponentBase } from "../../Components/ComponentBase";
import { JSONProcessor } from "../../Components/JSONProcessor";
import { TSProjectComponent } from "../../Project/Settings/TSProjectComponent";
import { CodeFileMappingCreator } from "../FileMappings/CodeFileMappingCreator";
import { CodeWorkspaceProvider } from "../FileMappings/CodeWorkspaceProvider";
import { WorkspaceFolderCreator } from "../FileMappings/WorkspaceFolderCreator";
import { WorkspaceFolderLoader } from "../FileMappings/WorkspaceFolderLoader";
import { IExtensionFile } from "../IExtensionFile";
import { ILaunchFile } from "../ILaunchFile";
import { ITaskFile } from "../ITaskFile";
import { IWorkspaceMetadata } from "../IWorkspaceMetadata";
import { WorkspaceProcessor } from "../WorkspaceProcessor";

/**
 * Provides a component for creating a vscode-workspace.
 */
export class CodeWorkspaceComponent<T extends IGeneratorSettings> extends ComponentBase<T>
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
     * Gets a component for loading vscode-workspaces.
     */
    public get Source(): CodeWorkspaceProvider<T>
    {
        return new WorkspaceFolderLoader(this);
    }

    /**
     * @inheritdoc
     */
    public get WorkspaceMetadata(): Promise<IWorkspaceMetadata>
    {
        return (
            async () =>
            {
                return this.WorkspaceProcessor.Process(await this.Source.WorkspaceMetadata);
            })();
    }

    /**
     * Gets the meta-data of the extensions to write.
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
     * Gets the meta-data of the debug-settings to write.
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
     * Gets the metadata of the settings to write.
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
     * Gets the metadata of the tasks to write.
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
     * Gets a component for processing the workspace.
     */
    protected get WorkspaceProcessor(): JSONProcessor<T, IWorkspaceMetadata>
    {
        return new WorkspaceProcessor(this);
    }

    /**
     * Gets a component for creating file-mappings.
     */
    protected get FileMappingCreator(): CodeFileMappingCreator<T>
    {
        return new WorkspaceFolderCreator(this);
    }
}
