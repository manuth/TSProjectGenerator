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
    private workspace: Promise<IWorkspaceMetadata> = (
        async (): Promise<IWorkspaceMetadata> =>
        {
            return {
                folders: []
            };
        })();

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
     * @inheritdoc
     */
    public override get ExtensionsMetadata(): Promise<IExtensionSettings>
    {
        return (async () => (await this.WorkspaceMetadata).extensions)();
    }

    /**
     * @inheritdoc
     */
    public override get LaunchMetadata(): Promise<ILaunchSettings>
    {
        return (async () => (await this.WorkspaceMetadata).launch)();
    }

    /**
     * @inheritdoc
     */
    public override get SettingsMetadata(): Promise<Record<string, any>>
    {
        return (async () => (await this.WorkspaceMetadata).settings)();
    }

    /**
     * @inheritdoc
     */
    public override get TasksMetadata(): Promise<ITaskSettings>
    {
        return (async () => (await this.WorkspaceMetadata).tasks)();
    }

    /**
     * Gets or sets the workspace-metadata.
     */
    public get WorkspaceMetadata(): Promise<IWorkspaceMetadata>
    {
        return this.workspace;
    }

    /**
     * @inheritdoc
     */
    public set WorkspaceMetadata(value: Promise<IWorkspaceMetadata>)
    {
        this.workspace = value;
    }

    /**
     * @inheritdoc
     *
     * @param path
     * The path to the JSON file to read.
     *
     * @returns
     * The JSON read from the {@link path `path`}.
     */
    public override async ReadJSON(path: string): Promise<any>
    {
        return super.ReadJSON(path);
    }
}
