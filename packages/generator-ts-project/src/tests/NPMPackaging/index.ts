import { basename } from "path";
import { DependencyTests } from "./Dependencies";
import { FileMappingTests } from "./FileMappings";
import { ScriptMappingTests } from "./Scripts/ScriptMapping.test";

/**
 * Registers tests for npm-packaging components.
 */
export function NPMPackagingTests(): void
{
    suite(
        basename(__dirname),
        () =>
        {
            DependencyTests();
            ScriptMappingTests();
            FileMappingTests();
        });
}
