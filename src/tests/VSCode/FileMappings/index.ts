import { TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { CodeWorkspaceProviderTests } from "./CodeWorkspaceProvider.test";

/**
 * Registers tests for vscode-filemappings.
 *
 * @param context
 * The test-context.
 */
export function FileMappingTests(context: TestContext<TestGenerator>): void
{
    suite(
        "FileMappings",
        () =>
        {
            CodeWorkspaceProviderTests(context);
        });
}
