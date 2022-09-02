import { basename } from "path";
import { CodeWorkspaceProviderTests } from "./CodeWorkspaceProvider.test.js";
import { WorkspaceFileCreatorTests } from "./WorkspaceFileCreator.test.js";
import { WorkspaceFolderCreatorTest } from "./WorkspaceFolderCreator.test.js";
import { WorkspaceFolderLoaderTests } from "./WorkspaceFolderLoader.test.js";

/**
 * Registers tests for vscode file-mappings.
 */
export function FileMappingTests(): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            CodeWorkspaceProviderTests();
            WorkspaceFolderLoaderTests();
            WorkspaceFolderCreatorTest();
            WorkspaceFileCreatorTests();
        });
}
