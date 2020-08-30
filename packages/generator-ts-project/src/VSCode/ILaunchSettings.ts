import { DebugConfiguration } from "vscode";

/**
 * Represents the launch-settings.
 */
export interface ILaunchSettings
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
