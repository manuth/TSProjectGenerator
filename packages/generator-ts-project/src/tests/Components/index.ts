import { ITestGeneratorOptions, ITestOptions, TestGenerator } from "@manuth/extended-yo-generator-test";
import { TestContext } from "../TestContext";
import { FileMappingBaseTests } from "./FileMappingBase.test";
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
            FileMappingBaseTests(context);
            TransformationTests(context);
        });
}
