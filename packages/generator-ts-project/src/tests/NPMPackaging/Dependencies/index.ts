import { basename } from "path";
import { ITestGeneratorOptions, ITestOptions, TestGenerator } from "@manuth/extended-yo-generator-test";
import { TestContext } from "../../TestContext";
import { BuildDependencyTests } from "./BuildDependencies.test";
import { CommonDependencyTests } from "./CommonDependencies.test";
import { LintDependencyTests } from "./LintDependencies.test";
import { LintEssentialTests } from "./LintEssentials.test";
import { MyPackageDependencyCollectionTests } from "./MyPackageDependencyCollection.test";

/**
 * Registers tests for npm-packaging dependencies.
 *
 * @param context
 * The test-context.
 */
export function DependencyTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        basename(__dirname),
        () =>
        {
            MyPackageDependencyCollectionTests(context);
            BuildDependencyTests();
            CommonDependencyTests();
            LintEssentialTests();
            LintDependencyTests();
        });
}
