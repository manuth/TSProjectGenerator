import { TestGenerator, ITestGeneratorOptions, ITestOptions } from "@manuth/extended-yo-generator-test";
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
        "Components",
        () =>
        {
            CodeWorkspaceComponentTests(context);
        });
}
