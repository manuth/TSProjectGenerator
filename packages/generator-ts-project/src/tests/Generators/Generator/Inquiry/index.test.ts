import { basename } from "node:path";
import { TSGeneratorGenerator } from "../../../../generators/generator/TSGeneratorGenerator.js";
import { TestContext } from "../../../TestContext.js";
import { TSGeneratorModuleNameQuestionTests } from "./TSGeneratorModuleNameQuestion.test.js";
import { TSGeneratorQuestionCollectionTests } from "./TSGeneratorQuestionCollection.test.js";

/**
 * Registers inquiry-components for the {@link TSGeneratorGenerator `TSGeneratorGenerator<TSettings, TOptions>`}.
 *
 * @param context
 * The test-context.
 */
export function InquiryTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            TSGeneratorModuleNameQuestionTests(context);
            TSGeneratorQuestionCollectionTests(context);
        });
}
