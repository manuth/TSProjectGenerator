import { CodeWorkspaceComponent } from "../../../VSCode/Components/CodeWorkspaceComponent";
import { VSCodeSettingsFileMapping } from "../../../VSCode/FileMappings/VSCodeSettingsFileMapping";
import { ITSProjectSettings } from "../../Settings/ITSProjectSettings";

/**
 * Provides a file-mapping for copying the launch.json file for `TSProject`s.
 */
export class TSProjectSettingsFileMapping<T extends ITSProjectSettings> extends VSCodeSettingsFileMapping<T>
{
    /**
     * Initializes a new instance of the `TSProjectSettingsFileMapping<T>` class.
     *
     * @param codeWorkspaceComponent
     * The component of this file-mapping.
     */
    public constructor(codeWorkspaceComponent: CodeWorkspaceComponent<T>)
    {
        super(codeWorkspaceComponent);
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
