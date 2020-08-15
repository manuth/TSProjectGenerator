import { TestGenerator, ITestGeneratorOptions, ITestOptions } from "@manuth/extended-yo-generator-test";
import { TestContext } from "../../TestContext";
import { JSONTransformMappingTests } from "./JSONTransformMapping.test";
import { TransformFileMappingTests } from "./TransformFileMapping.test";
import { YAMLTransformMappingTests } from "./YAMLTransformMapping.test";

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
            JSONTransformMappingTests(context);
            YAMLTransformMappingTests(context);
        });
}
