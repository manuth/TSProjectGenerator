import { ITestGeneratorOptions, ITestOptions, TestGenerator } from "@manuth/extended-yo-generator-test";
import { TestContext } from "../../TestContext";
import { JSONTransformMappingTests } from "./JSONTransformMapping.test";
import { TransformFileMappingTests } from "./TransformFileMapping.test";
import { TypeScriptTransformMappingTests } from "./TypeScriptTransformMapping.test";
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
            TypeScriptTransformMappingTests(context);
        });
}
