import { basename } from "path";
import { ITestGeneratorOptions, ITestOptions, TestGenerator } from "@manuth/extended-yo-generator-test";
import { TestContext } from "../../TestContext";
import { JSONCTransformMappingTests } from "./JSONCTransformMapping.test";
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
        basename(__dirname),
        () =>
        {
            JSONCTransformMappingTests(context);
            YAMLTransformMappingTests(context);
            TypeScriptTransformMappingTests(context);
        });
}
