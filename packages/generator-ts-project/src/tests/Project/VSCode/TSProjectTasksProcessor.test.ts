import Assert = require("assert");
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { TaskDefinition } from "vscode";
import { TSProjectWorkspaceFolder } from "../../../Project/Components/TSProjectCodeWorkspaceComponent";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";
import { TSProjectTasksProcessor } from "../../../Project/VSCode/TSProjectTasksProcessor";
import { TestContext } from "../../TestContext";

/**
 * Registers tests for the `TSProjectTasksProcessor` class.
 *
 * @param context
 * The test-context.
 */
export function TSProjectTasksProcessorTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        "TSProjectTasksProcessor",
        () =>
        {
            let component: TSProjectWorkspaceFolder<ITSProjectSettings, GeneratorOptions>;
            let processor: TSProjectTasksProcessor<ITSProjectSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    component = new TSProjectWorkspaceFolder(await context.Generator);
                    processor = new TSProjectTasksProcessor(component);
                });

            /**
             * Processes the specified `task`.
             *
             * @param task
             * The task to process.
             *
             * @returns
             * The processed task.
             */
            async function ProcessTask(task: TaskDefinition): Promise<TaskDefinition>
            {
                return (await processor.Process(
                    {
                        version: "",
                        tasks: [
                            task
                        ]
                    })).tasks[0];
            }

            test(
                "Checking whether the problem-matcher of the `lint` task is correct…",
                async () =>
                {
                    let tasks = await processor.Process(await component.Source.TasksMetadata);

                    let lintTask = tasks.tasks.find(
                        (task) =>
                            typeof task.label === "string" &&
                            task.label.toLowerCase() === "lint");

                    Assert.ok(
                        typeof lintTask.problemMatcher === "string" &&
                        lintTask.problemMatcher.startsWith("$eslint"));
                });

            test(
                "Checking whether shell-scripts are converted to npm-scripts…",
                async () =>
                {
                    Assert.deepStrictEqual(
                        await ProcessTask(
                            {
                                type: "shell",
                                command: "npm",
                                args: [
                                    "run",
                                    "lint"
                                ]
                            }),
                        {
                            type: "npm",
                            script: "lint"
                        });
                });

            test(
                "Checking whether shell-scripts with unspecified npm-script names aren't converted…",
                async () =>
                {
                    let task = {
                        type: "shell",
                        command: "npm",
                        args: [
                            "run"
                        ]
                    };

                    Assert.deepStrictEqual(await ProcessTask(task), task);
                });

            test(
                "Checking whether arguments for the npm-scripts are preserved…",
                async () =>
                {
                    let args = [
                        "--target",
                        "Release"
                    ];

                    Assert.deepStrictEqual(
                        await ProcessTask(
                            {
                                type: "shell",
                                command: "npm",
                                args: [
                                    "run",
                                    "build",
                                    ...args
                                ]
                            }),
                        {
                            type: "npm",
                            script: "build",
                            args
                        });
                });

            test(
                "Checking whether inexistent properties aren't added to the task…",
                async () =>
                {
                    let task = {
                        type: "shell",
                        command: "npm",
                        args: [
                            "run",
                            "build"
                        ]
                    };

                    Assert.ok(!("label" in await ProcessTask(task)));
                });

            test(
                "Checking whether named workspace-folder directives are stripped from `options.cwd`…",
                async () =>
                {
                    /**
                     * Creates a new cwd-path.
                     *
                     * @param root
                     * The root of the cwd.
                     *
                     * @returns
                     * A new cwd-path.
                     */
                    let cwdCreator = (root: string): string => `${root}/src?`;

                    Assert.strictEqual(
                        (await ProcessTask(
                            {
                                type: "",
                                options: {
                                    cwd: cwdCreator(context.NamedWorkspaceFolderDirective)
                                }
                            })).options.cwd,
                        cwdCreator(context.WorkspaceFolderDirective));
                });

            test(
                "Checking whether `cwd`s pointing to the workspace-folder are removed…",
                async () =>
                {
                    Assert.ok(
                        !("cwd" in (await ProcessTask(
                            {
                                type: "",
                                options: {
                                    cwd: context.NamedWorkspaceFolderDirective,
                                    test: {}
                                }
                            })).options));
                });

            test(
                "Checking whether `options` are deleted if left empty…",
                async () =>
                {
                    Assert.ok(
                        !("options" in (await ProcessTask(
                            {
                                type: "",
                                options: {}
                            }))));

                    Assert.ok(
                        !("options" in (await ProcessTask(
                            {
                                type: "",
                                options: {
                                    cwd: context.NamedWorkspaceFolderDirective
                                }
                            }))));
                });

            test(
                "Checking whether unnecessary `fileLocation` options are deleted…",
                async () =>
                {
                    Assert.ok(
                        !("fileLocation" in (await ProcessTask(
                            {
                                type: "",
                                problemMatcher: {
                                    test: "",
                                    fileLocation: [
                                        "relative",
                                        context.NamedWorkspaceFolderDirective
                                    ]
                                }
                            })).problemMatcher));
                });

            test(
                "Checking whether problem-matchers only containing a `base` are processed correctly…",
                async () =>
                {
                    let base = "$eslint-compact";

                    Assert.strictEqual(
                        (await ProcessTask(
                            {
                                type: "",
                                problemMatcher: {
                                    base
                                }
                            })).problemMatcher,
                        base);

                    Assert.strictEqual(
                        (await ProcessTask(
                            {
                                type: "",
                                problemMatcher: {
                                    fileLocation: [
                                        "relative",
                                        context.NamedWorkspaceFolderDirective
                                    ],
                                    base
                                }
                            })).problemMatcher,
                        base);
                });

            test(
                "Checking whether unnecessary problemMatcher-arrays are simplified…",
                async () =>
                {
                    let problemMatcher = "$eslint-compact";

                    Assert.strictEqual(
                        (await ProcessTask(
                            {
                                type: "",
                                problemMatcher: [
                                    problemMatcher
                                ]
                            })).problemMatcher,
                        problemMatcher);
                });
        });
}
