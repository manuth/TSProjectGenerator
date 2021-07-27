import { ok, strictEqual } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { ITestGeneratorSettings } from "@manuth/extended-yo-generator-test";
import { TaskDefinition } from "vscode";
import { ITaskSettings } from "../../VSCode/ITaskSettings";
import { TasksProcessor } from "../../VSCode/TasksProcessor";
import { TestContext } from "../TestContext";
import { TestCodeWorkspaceComponent } from "./Components/TestCodeWorkspaceComponent";

/**
 * Registers tests for the {@link TasksProcessor `TasksProcessor<TSettings, TOptions>`} class.
 */
export function TasksProcessorTests(): void
{
    suite(
        nameof(TasksProcessor),
        () =>
        {
            let context = TestContext.Default;
            let includedTask: TaskDefinition;
            let excludedTask: TaskDefinition;
            let mutatedTask: TaskDefinition;
            let newType: string;
            let taskMeta: ITaskSettings;
            let processor: TasksProcessor<ITestGeneratorSettings, GeneratorOptions>;

            /**
             * Provides an implementation of the {@link TasksProcessor `TasksProcessor<TSettings, TOptions>`} class for testing.
             */
            class TestTasksProcessor extends TasksProcessor<ITestGeneratorSettings, GeneratorOptions>
            {
                /**
                 * @inheritdoc
                 *
                 * @param task
                 * The task to filter.
                 *
                 * @returns
                 * A value indicating whether the task should be included.
                 */
                public override async FilterTask(task: TaskDefinition): Promise<boolean>
                {
                    return task !== excludedTask;
                }

                /**
                 * @inheritdoc
                 *
                 * @param task
                 * The task to process.
                 *
                 * @returns
                 * The processed task.
                 */
                public override async ProcessTask(task: TaskDefinition): Promise<TaskDefinition>
                {
                    if (task === mutatedTask)
                    {
                        return {
                            type: newType
                        };
                    }
                    else
                    {
                        return task;
                    }
                }
            }

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    processor = new TestTasksProcessor(new TestCodeWorkspaceComponent(await context.Generator));
                });

            setup(
                () =>
                {
                    includedTask = {
                        type: context.Random.string(8)
                    };

                    excludedTask = {
                        type: context.Random.string(9)
                    };

                    mutatedTask = {
                        type: context.Random.string(10)
                    };

                    newType = context.Random.string(11);

                    taskMeta = {
                        version: "",
                        tasks: [
                            includedTask,
                            excludedTask,
                            mutatedTask
                        ]
                    };
                });

            suite(
                nameof<TasksProcessor<any, any>>((processor) => processor.Process),
                () =>
                {
                    test(
                        "Checking whether tasks are only processed if existent…",
                        async () =>
                        {
                            strictEqual(
                                (await processor.Process({ version: "", tasks: null })).tasks,
                                null);
                        });
                });

            suite(
                nameof<TestTasksProcessor>((processor) => processor.FilterTask),
                () =>
                {
                    test(
                        "Checking whether tasks can be filtered…",
                        async () =>
                        {
                            ok(taskMeta.tasks.includes(excludedTask));
                            ok((await processor.Process(taskMeta)).tasks.includes(includedTask));
                            ok(!(await processor.Process(taskMeta)).tasks.includes(excludedTask));
                        });
                });

            suite(
                nameof<TestTasksProcessor>((processor) => processor.ProcessTask),
                () =>
                {
                    test(
                        "Checking whether tasks can be pre-processed…",
                        async () =>
                        {
                            /**
                             * Checks whether the specified {@link taskMeta `taskMetadata`} contains the predefined mutation.
                             *
                             * @param taskMetadata
                             * The task-metadata.
                             *
                             * @param expected
                             * A value indicating whether a mutation is expected to exist.
                             */
                            function AssertMutation(taskMetadata: ITaskSettings, expected = true): void
                            {
                                strictEqual(
                                    taskMetadata.tasks.some(
                                        (task) => task.type === newType), expected);
                            }

                            AssertMutation(taskMeta, false);
                            AssertMutation(await processor.Process(taskMeta), true);
                        });
                });
        });
}
