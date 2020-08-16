import { JSONProcessor } from "../../../Components/JSONProcessor";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { TSProjectWorkspaceProcessor } from "../../../Project/VSCode/TSProjectWorkspaceProcessor";
import { CodeWorkspaceComponent } from "../../../VSCode/Components/CodeWorkspaceComponent";
import { ILaunchSettings } from "../../../VSCode/ILaunchSettings";
import { TSModuleLaunchFileProcessor } from "./TSModuleLaunchFileProcessor";

/**
 * Provides the functionality to process workspaces for `TSModule`s.
 */
export class TSModuleWorkspaceProcessor<T extends ITSProjectSettings> extends TSProjectWorkspaceProcessor<T>
{
    /**
     * Initializes a new instance of the `TSModuleWorkspaceProcessor` class.
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
    protected get LaunchFileProcessor(): JSONProcessor<T, ILaunchSettings>
    {
        return new TSModuleLaunchFileProcessor(this.Component);
    }
}
