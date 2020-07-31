import Assert = require("assert");
import { TestContext } from "@manuth/extended-yo-generator-test";
import { TSProjectCodeWorkspaceComponent } from "../../../../Project/Components/TSProjectCodeWorkspaceComponent";
import { TSProjectTasksFileMapping } from "../../../../Project/FileMappings/VSCode/TSProjectTasksFileMapping";
import { ITSProjectSettings } from "../../../../Project/Settings/ITSProjectSettings";
import { TSProjectGenerator } from "../../../../Project/TSProjectGenerator";
import { ITaskFile } from "../../../../VSCode/ITaskFile";
import { JSONFileMappingTester } from "../../../Components/JSONFileMappingTester";

/**
 * Registers tests for the `TSProjectTasksFileMapping` class.
 *
 * @param context
 * The test-context.
 */
export function TSProjectTasksFileMappingTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        "TSProjectTasksFileMapping",
        () =>
        {
            let fileMapping: TSProjectTasksFileMapping<ITSProjectSettings>;
            let tester: JSONFileMappingTester<TSProjectGenerator, ITSProjectSettings, TSProjectTasksFileMapping<ITSProjectSettings>>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    fileMapping = new TSProjectTasksFileMapping(new TSProjectCodeWorkspaceComponent(await context.Generator));
                    tester = new JSONFileMappingTester(await context.Generator, fileMapping);
                });

            test(
                "Checking whether the problem-matcher for the `lint` task is correct…",
                async () =>
                {
                    let tasksFile: ITaskFile = await tester.Metadata;
                    let lintTask = tasksFile.tasks.find(
                        (task) =>
                            typeof task.label === "string" &&
                            task.label.toLowerCase() === "lint");

                    Assert.ok(
                        typeof lintTask.problemMatcher === "string" &&
                        lintTask.problemMatcher.startsWith("$eslint"));
                });
        });
}
