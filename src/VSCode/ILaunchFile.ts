import { DebugConfiguration } from "vscode";

/**
 * Represents a launch-config file.
 */
export interface ILaunchFile
{
    /**
     * Gets or sets the launch-configurations.
     */
    configurations: DebugConfiguration[];
}
