import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { JSONProcessor } from "../../../Components/JSONProcessor";
import { TSProjectWorkspaceProcessor } from "../../../Project/VSCode/TSProjectWorkspaceProcessor";
import { CodeWorkspaceComponent } from "../../../VSCode/Components/CodeWorkspaceComponent";
import { ExtensionsProcessor } from "../../../VSCode/ExtensionsProcessor";
import { IExtensionSettings } from "../../../VSCode/IExtensionSettings";
import { ILaunchSettings } from "../../../VSCode/ILaunchSettings";
import { ITSGeneratorSettings } from "../Settings/ITSGeneratorSettings";
import { TSGeneratorLaunchFileProcessor } from "./TSGeneratorLaunchFileProcessor";

/**
 * Provides the functionality to process workspaces for `TSGenerator`s.
 */
export class TSGeneratorWorkspaceProcessor<TSettings extends ITSGeneratorSettings, TOptions extends GeneratorOptions> extends TSProjectWorkspaceProcessor<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the `TSGeneratorWorkspaceProcessor` class.
     *
     * @param component
     * The component of the processor.
     */
    public constructor(component: CodeWorkspaceComponent<TSettings, TOptions>)
    {
        super(component);
    }

    /**
     * @inheritdoc
     */
    protected get ExtensionsProcessor(): JSONProcessor<TSettings, TOptions, IExtensionSettings>
    {
        return new ExtensionsProcessor(this.Component);
    }

    /**
     * Gets a component for processing the debug-settings.
     */
    protected get LaunchFileProcessor(): JSONProcessor<TSettings, TOptions, ILaunchSettings>
    {
        return new TSGeneratorLaunchFileProcessor(this.Component);
    }
}
