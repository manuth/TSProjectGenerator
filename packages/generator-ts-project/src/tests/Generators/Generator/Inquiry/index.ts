import { TSGeneratorGenerator } from "../../../../generators/generator/TSGeneratorGenerator";
import { TestContext } from "../../../TestContext";
import { TSGeneratorModuleNameQuestionTests } from "./TSGeneratorModuleNameQuestion.test";
import { TSGeneratorQuestionCollectionTests } from "./TSGeneratorQuestionCollection.test";

/**
 * Registers inquiry-components for the {@link TSGeneratorGenerator `TSGeneratorGenerator<TSettings, TOptions>`}.
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
            TSGeneratorQuestionCollectionTests(context);
        });
}
