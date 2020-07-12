import { TaskDefinition } from "vscode";

/**
 * Represents the content of a `tasks.json` file.
 */
export interface ITaskFile
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
