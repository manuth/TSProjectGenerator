import { GeneratorOptions, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { JSONProcessor } from "../Components/JSONProcessor.js";
import { CodeWorkspaceComponent } from "./Components/CodeWorkspaceComponent.js";
import { ExtensionsProcessor } from "./ExtensionsProcessor.js";
import { IExtensionSettings } from "./IExtensionSettings.js";
import { ILaunchSettings } from "./ILaunchSettings.js";
import { ITaskSettings } from "./ITaskSettings.js";
import { IWorkspaceMetadata } from "./IWorkspaceMetadata.js";
import { LaunchSettingsProcessor } from "./LaunchSettingsProcessor.js";
import { SettingsProcessor } from "./SettingsProcessor.js";
import { TasksProcessor } from "./TasksProcessor.js";
import { VSCodeJSONProcessor } from "./VSCodeJSONProcessor.js";

/**
 * Provides the functionality to process vscode workspaces.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class WorkspaceProcessor<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends VSCodeJSONProcessor<TSettings, TOptions, IWorkspaceMetadata>
{
    /**
     * Initializes a new instance of the {@link WorkspaceProcessor `WorkspaceProcessor<TSettings, TOptions>`} class.
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
     *
     * @param data
     * The data to process.
     *
     * @returns
     * The processed data.
     */
    public override async Process(data: IWorkspaceMetadata): Promise<IWorkspaceMetadata>
    {
        let result = await super.Process(data);

        if (result?.extensions)
        {
            result.extensions = await this.ExtensionsProcessor.Process(result.extensions);
        }

        if (result?.launch)
        {
            result.launch = await this.LaunchSettingsProcessor.Process(result.launch);
        }

        if (result?.settings)
        {
            result.settings = await this.SettingsProcessor.Process(result.settings);
        }

        if (result?.tasks)
        {
            result.tasks = await this.TasksProcessor.Process(result.tasks);
        }

        return result;
    }

    /**
     * Gets a component for processing the extensions.
     */
    protected get ExtensionsProcessor(): JSONProcessor<TSettings, TOptions, IExtensionSettings>
    {
        return new ExtensionsProcessor(this.Component);
    }

    /**
     * Gets a component for processing the debug-settings.
     */
    protected get LaunchSettingsProcessor(): JSONProcessor<TSettings, TOptions, ILaunchSettings>
    {
        return new LaunchSettingsProcessor(this.Component);
    }

    /**
     * Gets a component for processing the settings.
     */
    protected get SettingsProcessor(): JSONProcessor<TSettings, TOptions, Record<string, any>>
    {
        return new SettingsProcessor(this.Component);
    }

    /**
     * Gets a component for processing tasks.
     */
    protected get TasksProcessor(): JSONProcessor<TSettings, TOptions, ITaskSettings>
    {
        return new TasksProcessor(this.Component);
    }
}
