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
    private launchSettingsProcessor: JSONProcessor<TSettings, TOptions, ILaunchSettings> = new JSONProcessor(this.Generator);

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
    public override get ExtensionsProcessor(): JSONProcessor<TSettings, TOptions, IExtensionSettings>
    {
        return this.extensionsProcessor;
    }

    /**
     * @inheritdoc
     */
    public override set ExtensionsProcessor(value: JSONProcessor<TSettings, TOptions, IExtensionSettings>)
    {
        this.extensionsProcessor = value;
    }

    /**
     * Gets or sets a component for processing debug-settings.
     */
    public override get LaunchSettingsProcessor(): JSONProcessor<TSettings, TOptions, ILaunchSettings>
    {
        return this.launchSettingsProcessor;
    }

    /**
     * @inheritdoc
     */
    public override set LaunchSettingsProcessor(value: JSONProcessor<TSettings, TOptions, ILaunchSettings>)
    {
        this.launchSettingsProcessor = value;
    }

    /**
     * Gets or sets a component for processing settings.
     */
    public override get SettingsProcessor(): JSONProcessor<TSettings, TOptions, Record<string, any>>
    {
        return this.settingsProcessor;
    }

    /**
     * @inheritdoc
     */
    public override set SettingsProcessor(value: JSONProcessor<TSettings, TOptions, Record<string, any>>)
    {
        this.settingsProcessor = value;
    }

    /**
     * Gets or sets a component for processing tasks.
     */
    public override get TasksProcessor(): JSONProcessor<TSettings, TOptions, ITaskSettings>
    {
        return this.tasksProcessor;
    }

    /**
     * @inheritdoc
     */
    public override set TasksProcessor(value: JSONProcessor<TSettings, TOptions, ITaskSettings>)
    {
        this.tasksProcessor = value;
    }
}
