import Assert = require("assert");
import { TestContext, TestGenerator, ITestGeneratorSettings } from "@manuth/extended-yo-generator-test";
import { Random } from "random-js";
import { TaskDefinition } from "vscode";
import { ITaskFile } from "../../VSCode/ITaskFile";
import { TasksProcessor } from "../../VSCode/TasksProcessor";
import { TestCodeWorkspaceComponent } from "./Components/TestCodeWorkspaceComponent";

/**
 * Registers tests for the `TasksProcessor` class.
 *
 * @param context
 * The test-context.
 */
export function TasksProcessorTests(context: TestContext<TestGenerator>): void
{
    suite(
        "TasksProcessor",
        () =>
        {
            let random: Random;
            let includedTask: TaskDefinition;
            let excludedTask: TaskDefinition;
            let mutatedTask: TaskDefinition;
            let newType: string;
            let taskMeta: ITaskFile;
            let processor: TasksProcessor<ITestGeneratorSettings>;

            /**
             * Provides an implementation of the `TasksProcessor` class for testing.
             */
            class TestTasksProcessor extends TasksProcessor<ITestGeneratorSettings>
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
                protected async FilterTask(task: TaskDefinition): Promise<boolean>
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
                protected async ProcessTask(task: TaskDefinition): Promise<TaskDefinition>
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
                    this.timeout(0);
                    random = new Random();
                    processor = new TestTasksProcessor(new TestCodeWorkspaceComponent(await context.Generator));
                });

            setup(
                () =>
                {
                    includedTask = {
                        type: random.string(8)
                    };

                    excludedTask = {
                        type: random.string(9)
                    };

                    mutatedTask = {
                        type: random.string(10)
                    };

                    newType = random.string(11);

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
                "FilterTask",
                () =>
                {
                    test(
                        "Checking whether tasks can be filtered…",
                        async () =>
                        {
                            Assert.ok(taskMeta.tasks.includes(excludedTask));
                            Assert.ok((await processor.Process(taskMeta)).tasks.includes(includedTask));
                            Assert.ok(!(await processor.Process(taskMeta)).tasks.includes(excludedTask));
                        });
                });

            suite(
                "ProcessTask",
                () =>
                {
                    test(
                        "Checking whether tasks can be pre-processed…",
                        async () =>
                        {
                            /**
                             * Checks whether the specified `taskMeta` contains the predefined mutation.
                             *
                             * @param taskMeta
                             * The task-metadata.
                             *
                             * @param expected
                             * A value indicating whether a mutation is expected to exist.
                             */
                            function AssertMutation(taskMeta: ITaskFile, expected = true): void
                            {
                                Assert.strictEqual(
                                    taskMeta.tasks.some(
                                        (task) => task.type === newType), expected);
                            }

                            AssertMutation(taskMeta, false);
                            AssertMutation(await processor.Process(taskMeta), true);
                        });
                });
        });
}
