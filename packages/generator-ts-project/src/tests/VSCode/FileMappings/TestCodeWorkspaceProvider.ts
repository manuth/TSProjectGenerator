import { GeneratorOptions, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { CodeWorkspaceComponent } from "../../../VSCode/Components/CodeWorkspaceComponent";
import { CodeWorkspaceProvider } from "../../../VSCode/FileMappings/CodeWorkspaceProvider";
import { IExtensionSettings } from "../../../VSCode/IExtensionSettings";
import { ILaunchSettings } from "../../../VSCode/ILaunchSettings";
import { ITaskSettings } from "../../../VSCode/ITaskSettings";
import { IWorkspaceMetadata } from "../../../VSCode/IWorkspaceMetadata";

/**
 * Provides an implementation of the {@link CodeWorkspaceProvider `CodeWorkspaceProvider<TSettings, TOptions>`} class for testing.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class TestCodeWorkspaceProvider<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends CodeWorkspaceProvider<TSettings, TOptions>
{
    /**
     * The workspace-metadata.
     */
    private workspace: IWorkspaceMetadata = {
        folders: []
    };

    /**
     * Initializes a new instance of the {@link TestCodeWorkspaceProvider `TestCodeWorkspaceProvider<TSettings, TOptions>`} class.
     *
     * @param component
     * The component of this code-workspace provider.
     */
    public constructor(component: CodeWorkspaceComponent<TSettings, TOptions>)
    {
        super(component);
    }

    /**
     * Gets or sets the workspace-metadata.
     */
    public get WorkspaceMetadata(): IWorkspaceMetadata
    {
        return this.workspace;
    }

    /**
     * @inheritdoc
     */
    public set WorkspaceMetadata(value: IWorkspaceMetadata)
    {
        this.workspace = value;
    }

    /**
     * @inheritdoc
     *
     * @returns
     * The meta-data of the extensions.
     */
    public override async GetExtensionsMetadata(): Promise<IExtensionSettings>
    {
        return (await this.GetWorkspaceMetadata()).extensions;
    }

    /**
     * @inheritdoc
     *
     * @returns
     * The meta-data of the debug-settings.
     */
    public override async GetLaunchMetadata(): Promise<ILaunchSettings>
    {
        return (await this.GetWorkspaceMetadata()).launch;
    }

    /**
     * @inheritdoc
     *
     * @returns
     * The meta-data of the settings.
     */
    public override async GetSettingsMetadata(): Promise<Record<string, any>>
    {
        return (await this.GetWorkspaceMetadata()).settings;
    }

    /**
     * @inheritdoc
     *
     * @returns
     * The meta-data of the tasks.
     */
    public override async GetTasksMetadata(): Promise<ITaskSettings>
    {
        return (await this.GetWorkspaceMetadata()).tasks;
    }

    /**
     * @inheritdoc
     *
     * @returns
     * The meta-data of the workspace.
     */
    public async GetWorkspaceMetadata(): Promise<IWorkspaceMetadata>
    {
        return this.WorkspaceMetadata;
    }

    /**
     * @inheritdoc
     *
     * @param path
     * The path to the JSON file to read.
     *
     * @returns
     * The JSON read from the specified {@link path `path`}.
     */
    public override async ReadJSON(path: string): Promise<any>
    {
        return super.ReadJSON(path);
    }
}
