import { basename } from "path";
import { BuildDependencyTests } from "./BuildDependencies.test";
import { CommonDependencyTests } from "./CommonDependencies.test";
import { LintEssentialTests } from "./LintEssentials.test";
import { MyPackageDependencyCollectionTests } from "./MyPackageDependencyCollection.test";

/**
 * Registers tests for npm-packaging dependencies.
 */
export function DependencyTests(): void
{
    suite(
        basename(__dirname),
        () =>
        {
            MyPackageDependencyCollectionTests();
            BuildDependencyTests();
            CommonDependencyTests();
            LintEssentialTests();
        });
}
