import { TestContext, TestGenerator, ITestGeneratorOptions, ITestOptions } from "@manuth/extended-yo-generator-test";
import { TransformFileMappingTests } from "./TransformFileMapping.test";
import { TypeScriptTransformMappingTests } from "./TypeScriptTransformMapping.test";

/**
 * Registers tests for the transformation-components.
 *
 * @param context
 * The test-context.
 */
export function TransformationTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "Transformation",
        () =>
        {
            TransformFileMappingTests(context);
            TypeScriptTransformMappingTests(context);
        });
}
