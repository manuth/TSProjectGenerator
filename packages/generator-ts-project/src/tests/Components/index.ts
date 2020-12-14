import { ITestGeneratorOptions, ITestOptions, TestGenerator } from "@manuth/extended-yo-generator-test";
import { TestContext } from "../TestContext";
import { FileMappingBaseTests } from "./FileMappingBase.test";
import { JSONCreatorMappingTests } from "./JSONCreatorMapping.test";
import { TransformationTests } from "./Transformation";
import { YAMLCreatorMappingTests } from "./YAMLCreatorMapping.test";

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
            JSONCreatorMappingTests(context);
            YAMLCreatorMappingTests(context);
        });
}
