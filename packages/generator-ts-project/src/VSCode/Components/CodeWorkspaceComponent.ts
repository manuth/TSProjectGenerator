import { ComponentOptions, GeneratorOptions, IFileMapping, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { JSONProcessor } from "../../Components/JSONProcessor.js";
import { TSProjectComponent } from "../../Project/Settings/TSProjectComponent.js";
import { CodeFileMappingCreator } from "../FileMappings/CodeFileMappingCreator.js";
import { CodeWorkspaceProvider } from "../FileMappings/CodeWorkspaceProvider.js";
import { WorkspaceFolderCreator } from "../FileMappings/WorkspaceFolderCreator.js";
import { WorkspaceFolderLoader } from "../FileMappings/WorkspaceFolderLoader.js";
import { IExtensionSettings } from "../IExtensionSettings.js";
import { ILaunchSettings } from "../ILaunchSettings.js";
import { ITaskSettings } from "../ITaskSettings.js";
import { IWorkspaceMetadata } from "../IWorkspaceMetadata.js";
import { WorkspaceProcessor } from "../WorkspaceProcessor.js";

/**
 * Provides a component for creating a vscode-workspace.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class CodeWorkspaceComponent<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends ComponentOptions<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link CodeWorkspaceComponent `CodeWorkspaceComponent<TSettings, TOptions>`} class.
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
    public override get DefaultEnabled(): boolean
    {
        return true;
    }

    /**
     * @inheritdoc
     */
    public override get FileMappings(): Array<IFileMapping<TSettings, TOptions>>
    {
        return this.FileMappingCreator.FileMappings;
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
     *
     * @returns
     * The meta-data of the workspace.
     */
    public async GetWorkspaceMetadata(): Promise<IWorkspaceMetadata>
    {
        return this.WorkspaceProcessor.Process(await this.Source.GetWorkspaceMetadata());
    }

    /**
     * Gets the meta-data of the extensions to write.
     *
     * @returns
     * The meta-data of the extensions.
     */
    public async GetExtensionsMetadata(): Promise<IExtensionSettings>
    {
        return (await this.GetWorkspaceMetadata()).extensions;
    }

    /**
     * Gets the meta-data of the debug-settings to write.
     *
     * @returns
     * The meta-data of the debug-settings.
     */
    public async GetLaunchMetadata(): Promise<ILaunchSettings>
    {
        return (await this.GetWorkspaceMetadata()).launch;
    }

    /**
     * Gets the metadata of the settings to write.
     *
     * @returns
     * The meta-data of the settings.
     */
    public async GetSettingsMetadata(): Promise<Record<string, any>>
    {
        return (await this.GetWorkspaceMetadata()).settings;
    }

    /**
     * Gets the metadata of the tasks to write.
     *
     * @returns
     * The meta-data of the tasks.
     */
    public async GetTasksMetadata(): Promise<ITaskSettings>
    {
        return (await this.GetWorkspaceMetadata()).tasks;
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
