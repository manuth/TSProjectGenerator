import { GeneratorOptions, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { JSONProcessor } from "../../../Components/JSONProcessor.js";
import { CodeWorkspaceComponent } from "../../../VSCode/Components/CodeWorkspaceComponent.js";
import { IExtensionSettings } from "../../../VSCode/IExtensionSettings.js";
import { ILaunchSettings } from "../../../VSCode/ILaunchSettings.js";
import { ITaskSettings } from "../../../VSCode/ITaskSettings.js";
import { WorkspaceProcessor } from "../../../VSCode/WorkspaceProcessor.js";

/**
 * Provides an implementation of the {@link WorkspaceProcessor `WorkspaceProcessor<TSettings, TOptions>`} class for testing.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
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
     * Initializes a new instance of the {@link TestWorkspaceProcessor `TestWorkspaceProcessor<TSettings, TOptions>`} class.
     *
     * @param component
     * The component of the processor.
     */
    public constructor(component: CodeWorkspaceComponent<TSettings, TOptions>)
    {
        super(component);
    }

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
