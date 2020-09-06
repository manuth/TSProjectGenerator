import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { JSONProcessor } from "../../../Components/JSONProcessor";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { TSProjectWorkspaceProcessor } from "../../../Project/VSCode/TSProjectWorkspaceProcessor";
import { CodeWorkspaceComponent } from "../../../VSCode/Components/CodeWorkspaceComponent";
import { ILaunchSettings } from "../../../VSCode/ILaunchSettings";
import { TSModuleLaunchSettingsProcessor } from "./TSModuleLaunchSettingsProcessor";

/**
 * Provides the functionality to process workspaces for `TSModule`s.
 */
export class TSModuleWorkspaceProcessor<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends TSProjectWorkspaceProcessor<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the `TSModuleWorkspaceProcessor` class.
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
    protected get LaunchSettingsProcessor(): JSONProcessor<TSettings, TOptions, ILaunchSettings>
    {
        return new TSModuleLaunchSettingsProcessor(this.Component);
    }
}
