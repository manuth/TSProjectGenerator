import { TestContext, TestGenerator, ITestGeneratorOptions, ITestOptions } from "@manuth/extended-yo-generator-test";
import { AppGeneratorTests } from "./AppGenerator.test";

/**
 * Registers tests for the generators.
 *
 * @param context
 * The test-context.
 */
export function AppTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "App",
        () =>
        {
            AppGeneratorTests();
        });
}
