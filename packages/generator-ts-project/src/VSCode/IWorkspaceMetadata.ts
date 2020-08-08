import { IExtensionFile } from "./IExtensionFile";
import { ILaunchFile } from "./ILaunchFile";
import { ITaskFile } from "./ITaskFile";

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
    extensions?: IExtensionFile;

    /**
     * The debug-configurations of the workspace folder.
     */
    launch?: ILaunchFile;

    /**
     * The settings of the workspace folder.
     */
    settings?: Record<string, any>;

    /**
     * The tasks of the workspace folder.
     */
    tasks?: ITaskFile;
}
