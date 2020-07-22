import JSON = require("comment-json");
import { readFile } from "fs-extra";
import { join } from "upath";
import { TaskDefinition } from "vscode";
import { ITSProjectSettings } from "../../Project/Settings/ITSProjectSettings";
import { ITaskFile } from "../../VSCode/ITaskFile";
import { CodeWorkspaceComponent } from "../Components/CodeWorkspaceComponent";
import { VSCodeJSONFileMapping } from "./VSCodeJSONFileMapping";

/**
 * Provides a file-mapping for copying the `launch.json` file.
 */
export class VSCodeTasksFileMapping<T extends ITSProjectSettings> extends VSCodeJSONFileMapping<T>
{
    /**
     * Initializes a new instance of the `VSCodeTasksFileMapping<T>` class.
     *
     * @param codeWorkspaceComponent
     * The component of this file-mapping.
     */
    public constructor(codeWorkspaceComponent: CodeWorkspaceComponent<T>)
    {
        super(codeWorkspaceComponent);
    }

    /**
     * @inheritdoc
     */
    public get Source(): Promise<string>
    {
        return (
            async () =>
            {
                return this.Generator.modulePath(await this.SettingsFolderName, "tasks.json");
            })();
    }

    /**
     * @inheritdoc
     */
    public get Destination(): Promise<string>
    {
        return (
            async () =>
            {
                return join(await this.SettingsFolderName, "tasks.json");
            })();
    }

    /**
     * @inheritdoc
     */
    protected get Metadata(): Promise<ITaskFile>
    {
        return (
            async () =>
            {
                let result: ITaskFile = JSON.parse((await readFile(await this.Resolved.Source)).toString());
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
            })();
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
