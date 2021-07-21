import { ITestGeneratorOptions, ITestOptions, TestGenerator } from "@manuth/extended-yo-generator-test";
import { TestContext } from "../../TestContext";
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
        "Dependencies",
        () =>
        {
            MyPackageDependencyCollectionTests(context);
        });
}
