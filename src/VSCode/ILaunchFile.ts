import { DebugConfiguration } from "vscode";

/**
 * Represents a launch-config file.
 */
export interface ILaunchFile
{
    /**
     * The version of the meta-data format.
     */
    version: string;

    /**
     * Gets or sets the launch-configurations.
     */
    configurations: DebugConfiguration[];
}
