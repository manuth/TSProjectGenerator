import { JSONProcessor } from "../../Components/JSONProcessor";
import { CodeWorkspaceComponent } from "../../VSCode/Components/CodeWorkspaceComponent";
import { IExtensionFile } from "../../VSCode/IExtensionFile";
import { ILaunchFile } from "../../VSCode/ILaunchFile";
import { ITaskFile } from "../../VSCode/ITaskFile";
import { WorkspaceProcessor } from "../../VSCode/WorkspaceProcessor";
import { ITSProjectSettings } from "../Settings/ITSProjectSettings";
import { TSProjectExtensionsProcessor } from "./TSProjectExtensionsProcessor";
import { TSProjectLaunchFileProcessor } from "./TSProjectLaunchFileProcessor";
import { TSProjectSettingsProcessor } from "./TSProjectSettingsProcessor";
import { TSProjectTasksProcessor } from "./TSProjectTasksProcessor";

/**
 * Provides the functionality to process workspaces for `TSProject`s.
 */
export class TSProjectWorkspaceProcessor<T extends ITSProjectSettings> extends WorkspaceProcessor<T>
{
    /**
     * Initializes a new instance of the `TSProjectWorkspaceProcessor` class.
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
     */
    protected get ExtensionsProcessor(): JSONProcessor<T, IExtensionFile>
    {
        return new TSProjectExtensionsProcessor(this.Component);
    }

    /**
     * @inheritdoc
     */
    protected get LaunchFileProcessor(): JSONProcessor<T, ILaunchFile>
    {
        return new TSProjectLaunchFileProcessor(this.Component);
    }

    /**
     * @inheritdoc
     */
    protected get SettingsProcessor(): JSONProcessor<T, Record<string, any>>
    {
        return new TSProjectSettingsProcessor(this.Component);
    }

    /**
     * @inheritdoc
     */
    protected get TasksProcessor(): JSONProcessor<T, ITaskFile>
    {
        return new TSProjectTasksProcessor(this.Component);
    }
}
