import { JSONProcessor } from "../../Components/JSONProcessor";
import { CodeWorkspaceComponent } from "../../VSCode/Components/CodeWorkspaceComponent";
import { IExtensionSettings } from "../../VSCode/IExtensionSettings";
import { ILaunchSettings } from "../../VSCode/ILaunchSettings";
import { ITaskSettings } from "../../VSCode/ITaskSettings";
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
    protected get ExtensionsProcessor(): JSONProcessor<T, IExtensionSettings>
    {
        return new TSProjectExtensionsProcessor(this.Component);
    }

    /**
     * @inheritdoc
     */
    protected get LaunchFileProcessor(): JSONProcessor<T, ILaunchSettings>
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
    protected get TasksProcessor(): JSONProcessor<T, ITaskSettings>
    {
        return new TSProjectTasksProcessor(this.Component);
    }
}
