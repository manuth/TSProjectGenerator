import { basename } from "path";
import { ITestGeneratorOptions, ITestOptions, TestGenerator } from "@manuth/extended-yo-generator-test";
import { TestContext } from "../../TestContext";
import { CodeWorkspaceComponentTests } from "./CodeWorkspaceComponent.test";

/**
 * Registers tests for vscode-components.
 *
 * @param context
 * The test-context.
 */
export function ComponentTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        basename(__dirname),
        () =>
        {
            CodeWorkspaceComponentTests(context);
        });
}
