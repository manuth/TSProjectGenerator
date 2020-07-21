import { DebugConfiguration } from "vscode";
import { CodeWorkspaceComponent } from "../../../VSCode/Components/CodeWorkspaceComponent";
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
     * @param codeWorkspaceComponent
     * The component of this file-mapping.
     */
    public constructor(codeWorkspaceComponent: CodeWorkspaceComponent<T>)
    {
        super(codeWorkspaceComponent);
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
