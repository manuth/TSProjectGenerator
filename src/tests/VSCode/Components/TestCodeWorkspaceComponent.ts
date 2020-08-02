import { IGeneratorSettings, IFileMapping } from "@manuth/extended-yo-generator";
import { CodeWorkspaceComponent } from "../../../VSCode/Components/CodeWorkspaceComponent";

/**
 * Provides a test-implementation for the `CodeWorkspaceComponent` class.
 */
export class TestCodeWorkspaceComponent<T extends IGeneratorSettings> extends CodeWorkspaceComponent<T>
{
    /**
     * The name of the folder which contains the settings.
     */
    private settingsFolderName: Promise<string> = null;

    /**
     * A file-mapping for creating the `extensions.js` file.
     */
    private extensionsFileMapping: Promise<IFileMapping<T>> = null;

    /**
     * A file-mapping for creating the `launch.json` file.
     */
    private launchFileMapping: Promise<IFileMapping<T>> = null;

    /**
     * A file-mapping for creating the `settings.json` file.
     */
    private settingsFileMapping: Promise<IFileMapping<T>> = null;

    /**
     * A file-mapping for creating the `tasks.json` file.
     */
    private taskFileMapping: Promise<IFileMapping<T>> = null;

    /**
     * Gets or sets the name of the folder which contains the settings.
     */
    public get SettingsFolderName(): Promise<string>
    {
        return this.settingsFolderName ?? super.SettingsFolderName;
    }

    /**
     * @inheritdoc
     */
    public set SettingsFolderName(value: Promise<string>)
    {
        this.settingsFolderName = value;
    }

    /**
     * Gets or sets a file-mapping for creating the `extensions.json` file.
     */
    public get ExtensionsFileMapping(): Promise<IFileMapping<T>>
    {
        return this.extensionsFileMapping ?? super.ExtensionsFileMapping;
    }

    /**
     * @inheritdoc
     */
    public set ExtensionsFileMapping(value: Promise<IFileMapping<T>>)
    {
        this.extensionsFileMapping = value;
    }

    /**
     * Gets or sets a file-mapping for creating the `launch.json` file.
     */
    public get LaunchFileMapping(): Promise<IFileMapping<T>>
    {
        return this.launchFileMapping ?? super.LaunchFileMapping;
    }

    /**
     * @inheritdoc
     */
    public set LaunchFileMapping(value: Promise<IFileMapping<T>>)
    {
        this.launchFileMapping = value;
    }

    /**
     * Gets or sets a file-mapping for creating the `settings.json` file.
     */
    public get SettingsFileMapping(): Promise<IFileMapping<T>>
    {
        return this.settingsFileMapping ?? super.SettingsFileMapping;
    }

    /**
     * @inheritdoc
     */
    public set SettingsFileMapping(value: Promise<IFileMapping<T>>)
    {
        this.settingsFileMapping = value;
    }

    /**
     * Gets or sets a file-mapping for creating the `tasks.json` file.
     */
    public get TaskFileMapping(): Promise<IFileMapping<T>>
    {
        return this.taskFileMapping ?? super.TaskFileMapping;
    }

    /**
     * @inheritdoc
     */
    public set TaskFileMapping(value: Promise<IFileMapping<T>>)
    {
        this.taskFileMapping = value;
    }
}
