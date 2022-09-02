import { basename } from "node:path";
import { ScriptMappingTests } from "./ScriptMapping.test.js";

/**
 * Registers tests for npm-packaging scripts.
 */
export function ScriptTests(): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            ScriptMappingTests();
        });
}
