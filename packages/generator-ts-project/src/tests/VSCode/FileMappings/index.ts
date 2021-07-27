import { basename } from "path";
import { CodeWorkspaceProviderTests } from "./CodeWorkspaceProvider.test";
import { WorkspaceFileCreatorTests } from "./WorkspaceFileCreator.test";
import { WorkspaceFolderCreatorTest } from "./WorkspaceFolderCreator.test";
import { WorkspaceFolderLoaderTests } from "./WorkspaceFolderLoader.test";

/**
 * Registers tests for vscode file-mappings.
 *
 * @param context
 * The test-context.
 */
export function FileMappingTests(): void
{
    suite(
        basename(__dirname),
        () =>
        {
            CodeWorkspaceProviderTests();
            WorkspaceFolderLoaderTests();
            WorkspaceFolderCreatorTest();
            WorkspaceFileCreatorTests();
        });
}
