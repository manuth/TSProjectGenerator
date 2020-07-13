import { TaskDefinition } from "vscode";
import { VSCodeTasksFileMapping } from "../../../VSCode/FileMappings/VSCodeTasksFileMapping";
import { ITSProjectSettings } from "../../Settings/ITSProjectSettings";

/**
 * Provides a file-mapping for copying the `tasks.json` file.
 */
export class TSProjectTasksFileMapping<T extends ITSProjectSettings> extends VSCodeTasksFileMapping<T>
{
    /**
     * Initializes a new instance of the `TSProjectTasksFileMapping<T>` class.
     *
     * @param settingsFolderName
     * The name of the folder which contains the settings (such as `.vscode`, `.vscode-insiders` or `.vscodium`).
     */
    public constructor(settingsFolderName: string)
    {
        super(settingsFolderName);
    }

    /**
     * Processes a task-configuration.
     *
     * @param task
     * The task to process.
     *
     * @returns
     * The processed task.
     */
    protected async ProcessTask(task: TaskDefinition): Promise<TaskDefinition>
    {
        if (
            typeof task.label === "string" &&
            task.label.toLowerCase() === "lint")
        {
            if (
                typeof task.problemMatcher === "object" &&
                Array.isArray(task.problemMatcher))
            {
                task.problemMatcher = task.problemMatcher[0];
            }
        }

        return task;
    }
}
