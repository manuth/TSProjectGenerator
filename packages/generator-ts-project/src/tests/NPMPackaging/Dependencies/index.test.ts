import { basename } from "node:path";
import { BuildDependencyTests } from "./BuildDependencies.test.js";
import { CommonDependencyTests } from "./CommonDependencies.test.js";
import { LintEssentialTests } from "./LintEssentials.test.js";
import { MyPackageDependencyCollectionTests } from "./MyPackageDependencyCollection.test.js";

/**
 * Registers tests for npm-packaging dependencies.
 */
export function DependencyTests(): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            MyPackageDependencyCollectionTests();
            BuildDependencyTests();
            CommonDependencyTests();
            LintEssentialTests();
        });
}
