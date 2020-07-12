import { FileMappingBase } from "../../Components/FileMappingBase";
import { ITSProjectSettings } from "../../Project/ITSProjectSettings";

/**
 * Provides a file-mapping for a vscode workspace file.
 */
export abstract class VSCodeWorkspaceFileMapping<T extends ITSProjectSettings> extends FileMappingBase<T>
{
    /**
     * The name of the folder which contains the settings (such as `.vscode`, `.vscode-insiders` or `.vscodium`).
     */
    private settingsFolderName: string;

    /**
     * Initializes a new instance of the `VSCodeWorkspaceFileMapping` class.
     *
     * @param settingsFolderName
     * The name of the folder which contains the settings (such as `.vscode`, `.vscode-insiders` or `.vscodium`).
     */
    public constructor(settingsFolderName: string)
    {
        super();
        this.settingsFolderName = settingsFolderName;
    }

    /**
     * Gets the name of the folder which contains the settings (such as .vscode, .vscode-insiders or .vscodium).
     */
    protected get SettingsFolderName(): string
    {
        return this.settingsFolderName;
    }
}
