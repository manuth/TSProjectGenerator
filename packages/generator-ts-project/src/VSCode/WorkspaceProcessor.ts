import { IGeneratorSettings } from "@manuth/extended-yo-generator";
import { JSONProcessor } from "../Components/JSONProcessor";
import { CodeWorkspaceComponent } from "./Components/CodeWorkspaceComponent";
import { ExtensionsProcessor } from "./ExtensionsProcessor";
import { IExtensionFile } from "./IExtensionFile";
import { ILaunchFile } from "./ILaunchFile";
import { ITaskFile } from "./ITaskFile";
import { IWorkspaceMetadata } from "./IWorkspaceMetadata";
import { LaunchFileProcessor } from "./LaunchFileProcessor";
import { SettingsProcessor } from "./SettingsProcessor";
import { TasksProcessor } from "./TasksProcessor";
import { VSCodeJSONProcessor } from "./VSCodeJSONProcessor";

/**
 * Provides the functionality to process vscode workspaces.
 */
export class WorkspaceProcessor<T extends IGeneratorSettings> extends VSCodeJSONProcessor<T, IWorkspaceMetadata>
{
    /**
     * Initializes a new instance of the `WorkspaceProcessor` class.
     *
     * @param component
     * The component of the processor.
     */
    public constructor(component: CodeWorkspaceComponent<T>)
    {
        super(component);
    }

    /**
     * @inheritdoc
     *
     * @param data
     * The data to process.
     *
     * @returns
     * The processed data.
     */
    public async Process(data: IWorkspaceMetadata): Promise<IWorkspaceMetadata>
    {
        let result = await super.Process(data);
        result.extensions = await this.ExtensionsProcessor.Process(result.extensions);
        result.launch = await this.LaunchFileProcessor.Process(result.launch);
        result.settings = await this.SettingsProcessor.Process(result.settings);
        result.tasks = await this.TasksProcessor.Process(result.tasks);
        return result;
    }

    /**
     * Gets a component for processing the extensions.
     */
    protected get ExtensionsProcessor(): JSONProcessor<T, IExtensionFile>
    {
        return new ExtensionsProcessor(this.Component);
    }

    /**
     * Gets a component for processing the debug-settings.
     */
    protected get LaunchFileProcessor(): JSONProcessor<T, ILaunchFile>
    {
        return new LaunchFileProcessor(this.Component);
    }

    /**
     * Gets a component for processing the settings.
     */
    protected get SettingsProcessor(): JSONProcessor<T, Record<string, any>>
    {
        return new SettingsProcessor(this.Component);
    }

    /**
     * Gets a component for processing tasks.
     */
    protected get TasksProcessor(): JSONProcessor<T, ITaskFile>
    {
        return new TasksProcessor(this.Component);
    }
}
