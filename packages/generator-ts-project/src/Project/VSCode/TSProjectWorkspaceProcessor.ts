import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { JSONProcessor } from "../../Components/JSONProcessor";
import { CodeWorkspaceComponent } from "../../VSCode/Components/CodeWorkspaceComponent";
import { IExtensionSettings } from "../../VSCode/IExtensionSettings";
import { ILaunchSettings } from "../../VSCode/ILaunchSettings";
import { ITaskSettings } from "../../VSCode/ITaskSettings";
import { WorkspaceProcessor } from "../../VSCode/WorkspaceProcessor";
import { ITSProjectSettings } from "../Settings/ITSProjectSettings";
import { TSProjectExtensionsProcessor } from "./TSProjectExtensionsProcessor";
import { TSProjectLaunchSettingsProcessor } from "./TSProjectLaunchSettingsProcessor";
import { TSProjectSettingsProcessor } from "./TSProjectSettingsProcessor";
import { TSProjectTasksProcessor } from "./TSProjectTasksProcessor";

/**
 * Provides the functionality to process workspaces for `TSProject`s.
 */
export class TSProjectWorkspaceProcessor<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends WorkspaceProcessor<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the `TSProjectWorkspaceProcessor` class.
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
        return new TSProjectExtensionsProcessor(this.Component);
    }

    /**
     * @inheritdoc
     */
    protected get LaunchSettingsProcessor(): JSONProcessor<TSettings, TOptions, ILaunchSettings>
    {
        return new TSProjectLaunchSettingsProcessor(this.Component);
    }

    /**
     * @inheritdoc
     */
    protected get SettingsProcessor(): JSONProcessor<TSettings, TOptions, Record<string, any>>
    {
        return new TSProjectSettingsProcessor(this.Component);
    }

    /**
     * @inheritdoc
     */
    protected get TasksProcessor(): JSONProcessor<TSettings, TOptions, ITaskSettings>
    {
        return new TSProjectTasksProcessor(this.Component);
    }
}
