import Assert = require("assert");
import { TestContext } from "@manuth/extended-yo-generator-test";
import { TSProjectWorkspaceFolder } from "../../../Project/Components/TSProjectCodeWorkspaceComponent";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";
import { TSProjectTasksProcessor } from "../../../Project/VSCode/TSProjectTasksProcessor";

/**
 * Registers tests for the `TSProjectTasksProcessor` class.
 *
 * @param context
 * The test-context.
 */
export function TSProjectTasksProcessorTests(context: TestContext<TSProjectGenerator>): void
{
    suite.only(
        "TSProjectTasksProcessor",
        () =>
        {
            let component: TSProjectWorkspaceFolder<ITSProjectSettings>;
            let processor: TSProjectTasksProcessor<ITSProjectSettings>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    component = new TSProjectWorkspaceFolder(await context.Generator);
                    processor = new TSProjectTasksProcessor(component);
                });

            test(
                "Checking whether the problem-matcher of the `lint` task is correct…",
                async () =>
                {
                    let tasks = await processor.Process(await component.SourceTasks);

                    let lintTask = tasks.tasks.find(
                        (task) =>
                            typeof task.label === "string" &&
                            task.label.toLowerCase() === "lint");

                    Assert.ok(
                        typeof lintTask.problemMatcher === "string" &&
                        lintTask.problemMatcher.startsWith("$eslint"));
                });
        });
}
