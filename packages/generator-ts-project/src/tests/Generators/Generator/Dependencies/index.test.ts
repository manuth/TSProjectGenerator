import { basename } from "node:path";
import { TSGeneratorDependencyTests } from "./TSGeneratorDependencies.test.js";
import { TSGeneratorExampleDependencyTests } from "./TSGeneratorExampleDependencies.test.js";

/**
 * Registers tests for npm-packaging dependencies.
 */
export function DependencyTests(): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            TSGeneratorDependencyTests();
            TSGeneratorExampleDependencyTests();
        });
}
