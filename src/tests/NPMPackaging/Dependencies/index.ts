import { PackageDependencyCollectionTests } from "./PackageDependencyCollection.test";

/**
 * Registers tests for npm-packaging dependencies.
 */
export function DependencyTests(): void
{
    suite(
        "Dependencies",
        () =>
        {
            PackageDependencyCollectionTests();
        });
}
