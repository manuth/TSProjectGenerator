import { TestContext } from "@manuth/extended-yo-generator-test";
import { TSGeneratorGenerator } from "../../../generators/generator/TSGeneratorGenerator";
import { ComponentTests } from "./Components";
import { FileMappingTests } from "./FileMappings";
import { InquiryTests } from "./Inquiry";
import { TSGeneratorGeneratorTests } from "./TSGeneratorGenerator.test";

/**
 * Registers tests for the `Generator`-generator.
 *
 * @param context
 * The test-context.
 */
export function GeneratorTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        "Generator",
        () =>
        {
            FileMappingTests(context);
            InquiryTests(context);
            ComponentTests(context);
            TSGeneratorGeneratorTests(context);
        });
}
