import { TestContext } from "@manuth/extended-yo-generator-test";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";
import { TSProjectDescriptionQuestionTests } from "./TSProjectDescriptionQuestion.test";
import { TSProjectDestinationQuestionTests } from "./TSProjectDestinationQuestion.test";
import { TSProjectDisplayNameQuestionTests } from "./TSProjectDisplayNameQuestion.test";
import { TSProjectModuleNameQuestionTests } from "./TSProjectModuleNameQuestion.test";
import { TSProjectQuestionCollectionTests } from "./TSProjectQuestionCollection.test";

/**
 * Registers tests for inquiry-components for `TSProject`s.
 *
 * @param context
 * The test-context.
 */
export function InquiryTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        "Inquiry",
        () =>
        {
            TSProjectDestinationQuestionTests(context);
            TSProjectDisplayNameQuestionTests(context);
            TSProjectModuleNameQuestionTests(context);
            TSProjectDescriptionQuestionTests(context);
            TSProjectQuestionCollectionTests(context);
        });
}
