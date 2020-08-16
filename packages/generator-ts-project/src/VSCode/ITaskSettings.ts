import { TaskDefinition } from "vscode";

/**
 * Represents task-settings.
 */
export interface ITaskSettings
{
    /**
     * The version of the meta-data.
     */
    version: string;

    /**
     * The tasks.
     */
    tasks: TaskDefinition[];
}
