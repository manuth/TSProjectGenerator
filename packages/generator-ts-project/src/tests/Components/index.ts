import { ITestGeneratorOptions, ITestOptions, TestGenerator } from "@manuth/extended-yo-generator-test";
import { TestContext } from "../TestContext";
import { JSONCreatorMappingTests } from "./JSONCCreatorMapping.test";
import { TransformationTests } from "./Transformation";
import { YAMLCreatorMappingTests } from "./YAMLCreatorMapping.test";

/**
 * Registers tests for components.
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
            JSONCreatorMappingTests(context);
            YAMLCreatorMappingTests(context);
        });
}
