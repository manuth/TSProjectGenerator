import { basename } from "path";
import { DependencyTests } from "./Dependencies/index.test.js";
import { FileMappingTests } from "./FileMappings/index.test.js";
import { ScriptTests } from "./Scripts/index.test.js";

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
