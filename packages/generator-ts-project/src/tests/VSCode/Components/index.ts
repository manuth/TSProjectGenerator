import { basename } from "path";
import { CodeWorkspaceComponentTests } from "./CodeWorkspaceComponent.test";

/**
 * Registers tests for vscode-components.
 */
export function ComponentTests(): void
{
    suite(
        basename(__dirname),
        () =>
        {
            CodeWorkspaceComponentTests();
        });
}
