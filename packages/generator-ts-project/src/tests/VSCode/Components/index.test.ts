import { basename } from "path";
import { CodeWorkspaceComponentTests } from "./CodeWorkspaceComponent.test.js";

/**
 * Registers tests for vscode-components.
 */
export function ComponentTests(): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            CodeWorkspaceComponentTests();
        });
}
