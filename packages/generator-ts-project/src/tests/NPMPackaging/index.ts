import { basename } from "path";
import { DependencyTests } from "./Dependencies/index.js";
import { FileMappingTests } from "./FileMappings/index.js";
import { ScriptTests } from "./Scripts/index.js";

/**
 * Registers tests for npm-packaging components.
 */
export function NPMPackagingTests(): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            DependencyTests();
            ScriptTests();
            FileMappingTests();
        });
}
