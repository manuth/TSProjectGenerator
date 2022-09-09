import { IExtensionSettings } from "./IExtensionSettings.js";
import { ILaunchSettings } from "./ILaunchSettings.js";
import { ITaskSettings } from "./ITaskSettings.js";
import { WorkspaceFolder } from "./WorkspaceFolder.js";

/**
 * Provides metadata for a workspace.
 */
export interface IWorkspaceMetadata
{
    /**
     * The folders of the workspace.
     */
    folders: WorkspaceFolder[];

    /**
     * The extensions of the workspace folder.
     */
    extensions?: IExtensionSettings;

    /**
     * The debug-configurations of the workspace folder.
     */
    launch?: ILaunchSettings;

    /**
     * The settings of the workspace folder.
     */
    settings?: Record<string, any>;

    /**
     * The tasks of the workspace folder.
     */
    tasks?: ITaskSettings;
}
