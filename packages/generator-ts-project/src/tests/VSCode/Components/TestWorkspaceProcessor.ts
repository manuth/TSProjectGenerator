import { IGeneratorSettings } from "@manuth/extended-yo-generator";
import { JSONProcessor } from "../../../Components/JSONProcessor";
import { IExtensionSettings } from "../../../VSCode/IExtensionSettings";
import { ILaunchSettings } from "../../../VSCode/ILaunchSettings";
import { ITaskSettings } from "../../../VSCode/ITaskSettings";
import { WorkspaceProcessor } from "../../../VSCode/WorkspaceProcessor";

/**
 * Provides an implementation of the `WorkspaceProcessor` class for testing.
 */
export class TestWorkspaceProcessor<T extends IGeneratorSettings> extends WorkspaceProcessor<T>
{
    /**
     * A component for processing the extensions.
     */
    private extensionsProcessor: JSONProcessor<T, IExtensionSettings> = new JSONProcessor(this.Generator);

    /**
     * A component for processing debug-settings.
     */
    private launchFileProcessor: JSONProcessor<T, ILaunchSettings> = new JSONProcessor(this.Generator);

    /**
     * A component for processing settings.
     */
    private settingsProcessor: JSONProcessor<T, Record<string, any>> = new JSONProcessor(this.Generator);

    /**
     * A component for processing tasks.
     */
    private tasksProcessor: JSONProcessor<T, ITaskSettings> = new JSONProcessor(this.Generator);

    /**
     * Gets or sets a component for processing the extensions.
     */
    public get ExtensionsProcessor(): JSONProcessor<T, IExtensionSettings>
    {
        return this.extensionsProcessor;
    }

    /**
     * @inheritdoc
     */
    public set ExtensionsProcessor(value: JSONProcessor<T, IExtensionSettings>)
    {
        this.extensionsProcessor = value;
    }

    /**
     * Gets or sets a component for processing debug-settings.
     */
    public get LaunchFileProcessor(): JSONProcessor<T, ILaunchSettings>
    {
        return this.launchFileProcessor;
    }

    /**
     * @inheritdoc
     */
    public set LaunchFileProcessor(value: JSONProcessor<T, ILaunchSettings>)
    {
        this.launchFileProcessor = value;
    }

    /**
     * Gets or sets a component for processing settings.
     */
    public get SettingsProcessor(): JSONProcessor<T, Record<string, any>>
    {
        return this.settingsProcessor;
    }

    /**
     * @inheritdoc
     */
    public set SettingsProcessor(value: JSONProcessor<T, Record<string, any>>)
    {
        this.settingsProcessor = value;
    }

    /**
     * Gets or sets a component for processing tasks.
     */
    public get TasksProcessor(): JSONProcessor<T, ITaskSettings>
    {
        return this.tasksProcessor;
    }

    /**
     * @inheritdoc
     */
    public set TasksProcessor(value: JSONProcessor<T, ITaskSettings>)
    {
        this.tasksProcessor = value;
    }
}
