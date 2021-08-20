import { basename } from "path";
import { DependencyTests } from "./Dependencies";
import { FileMappingTests } from "./FileMappings";
import { ScriptTests } from "./Scripts";

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
            ScriptTests();
            FileMappingTests();
        });
}
