import { TestContext, TestGenerator, ITestOptions, ITestGeneratorOptions } from "@manuth/extended-yo-generator-test";
import { AppTests } from "./App";

/**
 * Registers tests for the generators.
 *
 * @param context
 * The test-context.
 */
export function GeneratorTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "Generators",
        () =>
        {
            AppTests(context);
            require("./TSGeneratorGenerator.test");
        });
}
