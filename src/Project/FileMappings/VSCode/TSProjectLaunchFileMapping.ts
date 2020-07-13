import { DebugConfiguration } from "vscode";
import { VSCodeLaunchFileMapping } from "../../../VSCode/FileMappings/VSCodeLaunchFileMapping";
import { ITSProjectSettings } from "../../Settings/ITSProjectSettings";

/**
 * Provides a file-mapping for copying the `launch.json` file for a `TSProject`.
 */
export class TSProjectLaunchFileMapping<T extends ITSProjectSettings> extends VSCodeLaunchFileMapping<T>
{
    /**
     * Initializes a new instance of the `TSProjectLaunchFileMapping<T>` class.
     *
     * @param settingsFolderName
     * The name of the folder which contains the settings (such as `.vscode`, `.vscode-insiders` or `.vscodium`).
     */
    public constructor(settingsFolderName: string)
    {
        super(settingsFolderName);
    }

    /**
     * Determines whether a debug-configuration should be included.
     *
     * @param debugConfig
     * The debug-configuration to filter.
     *
     * @returns
     * A value indicating whether the debug-configuration should be included.
     */
    protected async FilterDebugConfig(debugConfig: DebugConfiguration): Promise<boolean>
    {
        return !debugConfig.name.toLowerCase().includes("yeoman");
    }
}
