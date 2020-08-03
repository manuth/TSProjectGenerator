import { IGeneratorSettings } from "@manuth/extended-yo-generator";
import { TaskDefinition } from "vscode";
import { CodeWorkspaceComponent } from "./Components/CodeWorkspaceComponent";
import { ITaskFile } from "./ITaskFile";
import { VSCodeJSONProcessor } from "./VSCodeJSONProcessor";

/**
 * Provides the functionality to process vscode-tasks.
 */
export class TasksProcessor<T extends IGeneratorSettings> extends VSCodeJSONProcessor<T, ITaskFile>
{
    /**
     * Initializes a new instance of the `TasksProcessor` class.
     *
     * @param component
     * The component of the processor.
     */
    public constructor(component: CodeWorkspaceComponent<T>)
    {
        super(component);
    }

    /**
     * @inheritdoc
     *
     * @param data
     * The data to process.
     *
     * @returns
     * The processed data.
     */
    public async Process(data: ITaskFile): Promise<ITaskFile>
    {
        let result = await super.Process(data);
        result.tasks = result.tasks ?? [];

        for (let i = 0; i < result.tasks.length; i++)
        {
            if (await this.FilterTask(result.tasks[i]))
            {
                await this.ProcessTask(result.tasks[i]);
            }
            else
            {
                result.tasks.splice(i, 1);
            }
        }

        return result;
    }

    /**
     * Determines whether a task should be included.
     *
     * @param task
     * The task to filter.
     *
     * @returns
     * A value indicating whether the task should be included.
     */
    protected async FilterTask(task: TaskDefinition): Promise<boolean>
    {
        return true;
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
        return task;
    }
}
