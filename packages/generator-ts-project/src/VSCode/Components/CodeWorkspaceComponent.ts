import { GeneratorOptions, IFileMapping, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { ComponentBase } from "../../Components/ComponentBase";
import { JSONProcessor } from "../../Components/JSONProcessor";
import { TSProjectComponent } from "../../Project/Settings/TSProjectComponent";
import { CodeFileMappingCreator } from "../FileMappings/CodeFileMappingCreator";
import { CodeWorkspaceProvider } from "../FileMappings/CodeWorkspaceProvider";
import { WorkspaceFolderCreator } from "../FileMappings/WorkspaceFolderCreator";
import { WorkspaceFolderLoader } from "../FileMappings/WorkspaceFolderLoader";
import { IExtensionSettings } from "../IExtensionSettings";
import { ILaunchSettings } from "../ILaunchSettings";
import { ITaskSettings } from "../ITaskSettings";
import { IWorkspaceMetadata } from "../IWorkspaceMetadata";
import { WorkspaceProcessor } from "../WorkspaceProcessor";

/**
 * Provides a component for creating a vscode-workspace.
 */
export class CodeWorkspaceComponent<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends ComponentBase<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the `CodeWorkspaceComponent<T>` class.
     *
     * @param generator
     * The generator of the component.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>)
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
    public get FileMappings(): Promise<Array<IFileMapping<TSettings, TOptions>>>
    {
        return (
            async (): Promise<Array<IFileMapping<TSettings, TOptions>>> =>
            {
                return this.FileMappingCreator.FileMappings;
            })();
    }

    /**
     * Gets a component for loading vscode-workspaces.
     */
    public get Source(): CodeWorkspaceProvider<TSettings, TOptions>
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
    public get ExtensionsMetadata(): Promise<IExtensionSettings>
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
    public get LaunchMetadata(): Promise<ILaunchSettings>
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
    public get TasksMetadata(): Promise<ITaskSettings>
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
    protected get WorkspaceProcessor(): JSONProcessor<TSettings, TOptions, IWorkspaceMetadata>
    {
        return new WorkspaceProcessor(this);
    }

    /**
     * Gets a component for creating file-mappings.
     */
    protected get FileMappingCreator(): CodeFileMappingCreator<TSettings, TOptions>
    {
        return new WorkspaceFolderCreator(this);
    }
}
