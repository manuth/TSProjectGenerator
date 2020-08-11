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
            task.type === "shell" &&
            task.command === "npm" &&
            Array.isArray(task.args) &&
            task.args[0] === "run" &&
            task.args.length >= 2)
        {
            Object.assign(
                task,
                {
                    type: "npm"
                });

            delete task.command;
            task.script = task.args[1];
            task.args.splice(0, 2);

            if (task.args.length === 0)
            {
                delete task.args;
            }

            task = {
                ...("label" in task ? { label: task.label } : {}),
                type: task.type,
                script: task.script,
                ...task
            };
        }

        if (Array.isArray(task.args))
        {
            task.args = task.args.map((arg) => this.StripWorkspaceFolder(arg));
        }

        if (
            typeof task.options === "object" &&
            typeof task.options.cwd === "string")
        {
            task.options.cwd = this.StripWorkspaceFolder(task.options.cwd);

            if (task.options.cwd === "${workspaceFolder}")
            {
                delete task.options.cwd;
            }

            if (Object.keys(task.options).length === 0)
            {
                delete task.options;
            }
        }

        if (typeof task.problemMatcher === "object")
        {
            task.problemMatcher = (Array.isArray(task.problemMatcher) ? task.problemMatcher : [task.problemMatcher]).map(
                (problemMatcher) =>
                {
                    if (
                        Array.isArray(problemMatcher.fileLocation) &&
                        problemMatcher.fileLocation[0] === "relative" &&
                        this.StripWorkspaceFolder(problemMatcher.fileLocation[1]) === "${workspaceFolder}")
                    {
                        delete problemMatcher.fileLocation;
                    }

                    if (Object.keys(problemMatcher).every((key) => key === "base"))
                    {
                        return problemMatcher.base;
                    }
                    else
                    {
                        return problemMatcher;
                    }
                });

            if (task.problemMatcher.length === 1)
            {
                task.problemMatcher = task.problemMatcher[0];
            }
        }

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
