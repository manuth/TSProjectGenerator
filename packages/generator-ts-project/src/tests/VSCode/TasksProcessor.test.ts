import Assert = require("assert");
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { ITestGeneratorOptions, ITestGeneratorSettings, ITestOptions, TestGenerator } from "@manuth/extended-yo-generator-test";
import { TaskDefinition } from "vscode";
import { ITaskSettings } from "../../VSCode/ITaskSettings";
import { TasksProcessor } from "../../VSCode/TasksProcessor";
import { TestContext } from "../TestContext";
import { TestCodeWorkspaceComponent } from "./Components/TestCodeWorkspaceComponent";

/**
 * Registers tests for the `TasksProcessor` class.
 *
 * @param context
 * The test-context.
 */
export function TasksProcessorTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "TasksProcessor",
        () =>
        {
            let includedTask: TaskDefinition;
            let excludedTask: TaskDefinition;
            let mutatedTask: TaskDefinition;
            let newType: string;
            let taskMeta: ITaskSettings;
            let processor: TasksProcessor<ITestGeneratorSettings, GeneratorOptions>;

            /**
             * Provides an implementation of the `TasksProcessor` class for testing.
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
                "Process",
                () =>
                {
                    test(
                        "Checking whether tasks are only processed if existent…",
                        async () =>
                        {
                            Assert.strictEqual(
                                (await processor.Process({ version: "", tasks: null })).tasks,
                                null);
                        });
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
                            function AssertMutation(taskMeta: ITaskSettings, expected = true): void
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
