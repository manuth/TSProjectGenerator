import { VSCodeSettingsFileMapping } from "../../../VSCode/FileMappings/VSCodeSettingsFileMapping";
import { ITSProjectSettings } from "../../ITSProjectSettings";

/**
 * Provides a file-mapping for copying the launch.json file for `TSProject`s.
 */
export class ProjectSettingsFileMapping<T extends ITSProjectSettings> extends VSCodeSettingsFileMapping<T>
{
    /**
     * Initializes a new instance of the `ProjectSettingsFileMapping<T>` class.
     *
     * @param settingsFolderName
     * The name of the folder which contains the settings (such as `.vscode`, `.vscode-insiders` or `.vscodium`).
     */
    public constructor(settingsFolderName: string)
    {
        super(settingsFolderName);
    }

    /**
     * @inheritdoc
     *
     * @param key
     * The key of the setting
     *
     * @returns
     * A value indicating whether the setting with the specified key should be included.
     */
    protected async FilterSettingKey(key: string): Promise<boolean>
    {
        return key !== "files.associations";
    }
}
