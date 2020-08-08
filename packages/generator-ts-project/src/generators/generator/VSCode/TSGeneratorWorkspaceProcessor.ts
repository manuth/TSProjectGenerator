import { JSONProcessor } from "../../../Components/JSONProcessor";
import { TSProjectWorkspaceProcessor } from "../../../Project/VSCode/TSProjectWorkspaceProcessor";
import { CodeWorkspaceComponent } from "../../../VSCode/Components/CodeWorkspaceComponent";
import { ExtensionsProcessor } from "../../../VSCode/ExtensionsProcessor";
import { IExtensionFile } from "../../../VSCode/IExtensionFile";
import { ILaunchFile } from "../../../VSCode/ILaunchFile";
import { ITSGeneratorSettings } from "../Settings/ITSGeneratorSettings";
import { TSGeneratorLaunchFileProcessor } from "./TSGeneratorLaunchFileProcessor";

/**
 * Provides the functionality to process workspaces for `TSGenerator`s.
 */
export class TSGeneratorWorkspaceProcessor<T extends ITSGeneratorSettings> extends TSProjectWorkspaceProcessor<T>
{
    /**
     * Initializes a new instance of the `TSGeneratorWorkspaceProcessor` class.
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
        return new ExtensionsProcessor(this.Component);
    }

    /**
     * Gets a component for processing the debug-settings.
     */
    protected get LaunchFileProcessor(): JSONProcessor<T, ILaunchFile>
    {
        return new TSGeneratorLaunchFileProcessor(this.Component);
    }
}
