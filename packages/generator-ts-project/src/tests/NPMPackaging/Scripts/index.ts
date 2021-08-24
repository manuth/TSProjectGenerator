import { basename } from "path";
import { ScriptMappingTests } from "./ScriptMapping.test";

/**
 * Registers tests for npm-packaging scripts.
 */
export function ScriptTests(): void
{
    suite(
        basename(__dirname),
        () =>
        {
            ScriptMappingTests();
        });
}
