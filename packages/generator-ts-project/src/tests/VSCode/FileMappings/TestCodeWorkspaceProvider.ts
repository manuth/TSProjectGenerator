import { IGeneratorSettings } from "@manuth/extended-yo-generator";
import { CodeWorkspaceComponent } from "../../../VSCode/Components/CodeWorkspaceComponent";
import { CodeWorkspaceProvider } from "../../../VSCode/FileMappings/CodeWorkspaceProvider";
import { IExtensionFile } from "../../../VSCode/IExtensionFile";
import { ILaunchFile } from "../../../VSCode/ILaunchFile";
import { ITaskFile } from "../../../VSCode/ITaskFile";
import { IWorkspaceMetadata } from "../../../VSCode/IWorkspaceMetadata";

/**
 * Provides an implementation of the `CodeWorkspaceProvider` class for testing.
 */
export class TestCodeWorkspaceProvider<T extends IGeneratorSettings> extends CodeWorkspaceProvider<T>
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
     * @inheritdoc
     */
    public get ExtensionsMetadata(): Promise<IExtensionFile>
    {
        return (async () => (await this.WorkspaceMetadata).extensions)();
    }

    /**
     * @inheritdoc
     */
    public get LaunchMetadata(): Promise<ILaunchFile>
    {
        return (async () => (await this.WorkspaceMetadata).launch)();
    }

    /**
     * @inheritdoc
     */
    public get SettingsMetadata(): Promise<Record<string, any>>
    {
        return (async () => (await this.WorkspaceMetadata).settings)();
    }

    /**
     * @inheritdoc
     */
    public get TasksMetadata(): Promise<ITaskFile>
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
     * The JSON read from the `path`.
     */
    public async ReadJSON(path: string): Promise<any>
    {
        return super.ReadJSON(path);
    }
}
