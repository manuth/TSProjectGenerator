import { TestGenerator } from "@manuth/extended-yo-generator-test";
import { TestContext } from "../../TestContext";
import { CodeWorkspaceProviderTests } from "./CodeWorkspaceProvider.test";
import { WorkspaceFolderCreatorTest } from "./WorkspaceFolderCreator.test";
import { WorkspaceFolderLoaderTests } from "./WorkspaceFolderLoader.test";

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
            WorkspaceFolderLoaderTests(context);
            WorkspaceFolderCreatorTest(context);
        });
}
