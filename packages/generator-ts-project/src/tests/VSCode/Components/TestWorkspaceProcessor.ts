import { GeneratorOptions, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { JSONProcessor } from "../../../Components/JSONProcessor";
import { IExtensionSettings } from "../../../VSCode/IExtensionSettings";
import { ILaunchSettings } from "../../../VSCode/ILaunchSettings";
import { ITaskSettings } from "../../../VSCode/ITaskSettings";
import { WorkspaceProcessor } from "../../../VSCode/WorkspaceProcessor";

/**
 * Provides an implementation of the `WorkspaceProcessor` class for testing.
 */
export class TestWorkspaceProcessor<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends WorkspaceProcessor<TSettings, TOptions>
{
    /**
     * A component for processing the extensions.
     */
    private extensionsProcessor: JSONProcessor<TSettings, TOptions, IExtensionSettings> = new JSONProcessor(this.Generator);

    /**
     * A component for processing debug-settings.
     */
    private launchFileProcessor: JSONProcessor<TSettings, TOptions, ILaunchSettings> = new JSONProcessor(this.Generator);

    /**
     * A component for processing settings.
     */
    private settingsProcessor: JSONProcessor<TSettings, TOptions, Record<string, any>> = new JSONProcessor(this.Generator);

    /**
     * A component for processing tasks.
     */
    private tasksProcessor: JSONProcessor<TSettings, TOptions, ITaskSettings> = new JSONProcessor(this.Generator);

    /**
     * Gets or sets a component for processing the extensions.
     */
    public get ExtensionsProcessor(): JSONProcessor<TSettings, TOptions, IExtensionSettings>
    {
        return this.extensionsProcessor;
    }

    /**
     * @inheritdoc
     */
    public set ExtensionsProcessor(value: JSONProcessor<TSettings, TOptions, IExtensionSettings>)
    {
        this.extensionsProcessor = value;
    }

    /**
     * Gets or sets a component for processing debug-settings.
     */
    public get LaunchFileProcessor(): JSONProcessor<TSettings, TOptions, ILaunchSettings>
    {
        return this.launchFileProcessor;
    }

    /**
     * @inheritdoc
     */
    public set LaunchFileProcessor(value: JSONProcessor<TSettings, TOptions, ILaunchSettings>)
    {
        this.launchFileProcessor = value;
    }

    /**
     * Gets or sets a component for processing settings.
     */
    public get SettingsProcessor(): JSONProcessor<TSettings, TOptions, Record<string, any>>
    {
        return this.settingsProcessor;
    }

    /**
     * @inheritdoc
     */
    public set SettingsProcessor(value: JSONProcessor<TSettings, TOptions, Record<string, any>>)
    {
        this.settingsProcessor = value;
    }

    /**
     * Gets or sets a component for processing tasks.
     */
    public get TasksProcessor(): JSONProcessor<TSettings, TOptions, ITaskSettings>
    {
        return this.tasksProcessor;
    }

    /**
     * @inheritdoc
     */
    public set TasksProcessor(value: JSONProcessor<TSettings, TOptions, ITaskSettings>)
    {
        this.tasksProcessor = value;
    }
}
