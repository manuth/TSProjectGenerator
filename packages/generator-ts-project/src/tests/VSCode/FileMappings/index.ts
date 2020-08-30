import { TestGenerator, ITestGeneratorOptions, ITestOptions } from "@manuth/extended-yo-generator-test";
import { TestContext } from "../../TestContext";
import { CodeWorkspaceProviderTests } from "./CodeWorkspaceProvider.test";
import { WorkspaceFileCreatorTests } from "./WorkspaceFileCreator.test";
import { WorkspaceFolderCreatorTest } from "./WorkspaceFolderCreator.test";
import { WorkspaceFolderLoaderTests } from "./WorkspaceFolderLoader.test";

/**
 * Registers tests for vscode-filemappings.
 *
 * @param context
 * The test-context.
 */
export function FileMappingTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "FileMappings",
        () =>
        {
            CodeWorkspaceProviderTests(context);
            WorkspaceFolderLoaderTests(context);
            WorkspaceFolderCreatorTest(context);
            WorkspaceFileCreatorTests(context);
        });
}
