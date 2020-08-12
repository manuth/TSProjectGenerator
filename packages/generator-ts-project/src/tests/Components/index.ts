import { TestGenerator, ITestOptions, ITestGeneratorOptions } from "@manuth/extended-yo-generator-test";
import { TestContext } from "../TestContext";
import { TransformationTests } from "./Transformation";

/**
 * Registers tests for `Components`.
 *
 * @param context
 * The test-context.
 */
export function ComponentTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "Components",
        () =>
        {
            TransformationTests(context);
        });
}
