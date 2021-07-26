import { basename } from "path";
import { ITestGeneratorOptions, ITestOptions, TestGenerator } from "@manuth/extended-yo-generator-test";
import { TestContext } from "../TestContext";
import { InquiryTests } from "./Inquiry";
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
        basename(__dirname),
        () =>
        {
            InquiryTests();
            TransformationTests(context);
            JSONCreatorMappingTests(context);
            YAMLCreatorMappingTests(context);
        });
}
