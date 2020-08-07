import { IGeneratorSettings, IGenerator } from "@manuth/extended-yo-generator";
import { JSONProcessor } from "../../../Components/JSONProcessor";
import { CodeWorkspaceComponent } from "../../../VSCode/Components/CodeWorkspaceComponent";
import { CodeFileMappingCreator } from "../../../VSCode/FileMappings/CodeFileMappingCreator";
import { WorkspaceFolderCreator } from "../../../VSCode/FileMappings/WorkspaceFolderCreator";
import { IExtensionFile } from "../../../VSCode/IExtensionFile";
import { ILaunchFile } from "../../../VSCode/ILaunchFile";
import { ITaskFile } from "../../../VSCode/ITaskFile";
import { TestCodeWorkspaceProvider } from "../FileMappings/TestCodeWorkspaceProvider";

/**
 * Provides an implementation of the `CodeWorkspaceComponent` class for testing.
 */
export class TestCodeWorkspaceComponent<T extends IGeneratorSettings> extends CodeWorkspaceComponent<T>
{
    /**
     * A component for loading vscode-workspaces.
     */
    private source: TestCodeWorkspaceProvider<T> = new TestCodeWorkspaceProvider(this);

    /**
     * A component for creating file-mappings.
     */
    private fileMappingCreator: CodeFileMappingCreator<T> = new WorkspaceFolderCreator(this);

    /**
     * A component for processing the extensions.
     */
    private extensionsProcessor: JSONProcessor<T, IExtensionFile> = new JSONProcessor(this.Generator);

    /**
     * A component for processing debug-settings.
     */
    private launchFileProcessor: JSONProcessor<T, ILaunchFile> = new JSONProcessor(this.Generator);

    /**
     * A component for processing settings.
     */
    private settingsProcessor: JSONProcessor<T, Record<string, any>> = new JSONProcessor(this.Generator);

    /**
     * A component for processing tasks.
     */
    private tasksProcessor: JSONProcessor<T, ITaskFile> = new JSONProcessor(this.Generator);

    /**
     * Initializes a new instance of the `TestCodeWorkspaceComponent` class.
     *
     * @param generator
     * The generator of the component.
     */
    public constructor(generator: IGenerator<T>)
    {
        super(generator);
    }

    /**
     * Gets or sets a component for loading vscode-workspaces.
     */
    public get Source(): TestCodeWorkspaceProvider<T>
    {
        return this.source;
    }

    /**
     * @inheritdoc
     */
    public set Source(value: TestCodeWorkspaceProvider<T>)
    {
        this.source = value;
    }

    /**
     * Gets or sets a component for creating file-mappings.
     */
    public get FileMappingCreator(): CodeFileMappingCreator<T>
    {
        return this.fileMappingCreator;
    }

    /**
     * @inheritdoc
     */
    public set FileMappingCreator(value: CodeFileMappingCreator<T>)
    {
        this.fileMappingCreator = value;
    }

    /**
     * Gets or sets a component for processing the extensions.
     */
    public get ExtensionsProcessor(): JSONProcessor<T, IExtensionFile>
    {
        return this.extensionsProcessor;
    }

    /**
     * @inheritdoc
     */
    public set ExtensionsProcessor(value: JSONProcessor<T, IExtensionFile>)
    {
        this.extensionsProcessor = value;
    }

    /**
     * Gets or sets a component for processing debug-settings.
     */
    public get LaunchFileProcessor(): JSONProcessor<T, ILaunchFile>
    {
        return this.launchFileProcessor;
    }

    /**
     * @inheritdoc
     */
    public set LaunchFileProcessor(value: JSONProcessor<T, ILaunchFile>)
    {
        this.launchFileProcessor = value;
    }

    /**
     * Gets or sets a component for processing settings.
     */
    public get SettingsProcessor(): JSONProcessor<T, Record<string, any>>
    {
        return this.settingsProcessor;
    }

    /**
     * @inheritdoc
     */
    public set SettingsProcessor(value: JSONProcessor<T, Record<string, any>>)
    {
        this.settingsProcessor = value;
    }

    /**
     * Gets or sets a component for processing tasks.
     */
    public get TasksProcessor(): JSONProcessor<T, ITaskFile>
    {
        return this.tasksProcessor;
    }

    /**
     * @inheritdoc
     */
    public set TasksProcessor(value: JSONProcessor<T, ITaskFile>)
    {
        this.tasksProcessor = value;
    }
}
