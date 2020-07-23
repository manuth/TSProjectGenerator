import { TestContext } from "@manuth/extended-yo-generator-test";
import { TSGeneratorGenerator } from "../../../../generators/generator/TSGeneratorGenerator";
import { TSGeneratorModuleNameQuestionTests } from "./TSGeneratorModuleNameQuestion.test";

/**
 * Registers inquiry-components for the `Generator`-generator.
 *
 * @param context
 * The test-context.
 */
export function InquiryTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        "Inquiry",
        () =>
        {
            TSGeneratorModuleNameQuestionTests(context);
        });
}
