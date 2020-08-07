import { TaskDefinition } from "vscode";
import { CodeWorkspaceComponent } from "../../VSCode/Components/CodeWorkspaceComponent";
import { TasksProcessor } from "../../VSCode/TasksProcessor";
import { ITSProjectSettings } from "../Settings/ITSProjectSettings";

/**
 * Provides the functionality to process tasks for `TSProject`s.
 */
export class TSProjectTasksProcessor<T extends ITSProjectSettings> extends TasksProcessor<T>
{
    /**
     * Initializes a new instance of the `ExtensionsProcessor` class.
     *
     * @param component
     * The component of the processor.
     */
    public constructor(component: CodeWorkspaceComponent<T>)
    {
        super(component);
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
