import { GeneratorOptions, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { TaskDefinition } from "vscode";
import { CodeWorkspaceComponent } from "./Components/CodeWorkspaceComponent.js";
import { ITaskSettings } from "./ITaskSettings.js";
import { VSCodeJSONProcessor } from "./VSCodeJSONProcessor.js";

/**
 * Provides the functionality to process vscode-tasks.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class TasksProcessor<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends VSCodeJSONProcessor<TSettings, TOptions, ITaskSettings>
{
    /**
     * Initializes a new instance of the {@link TasksProcessor `TasksProcessor<TSettings, TOptions>`} class.
     *
     * @param component
     * The component of the processor.
     */
    public constructor(component: CodeWorkspaceComponent<TSettings, TOptions>)
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
    public override async Process(data: ITaskSettings): Promise<ITaskSettings>
    {
        let result = await super.Process(data);

        if (result?.tasks)
        {
            for (let i = result.tasks.length - 1; i >= 0; i--)
            {
                if (await this.FilterTask(result.tasks[i]))
                {
                    result.tasks[i] = await this.ProcessTask(result.tasks[i]);
                }
                else
                {
                    result.tasks.splice(i, 1);
                }
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
