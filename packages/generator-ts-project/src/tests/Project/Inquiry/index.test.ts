import { basename } from "node:path";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator.js";
import { TestContext } from "../../TestContext.js";
import { TSProjectDescriptionQuestionTests } from "./TSProjectDescriptionQuestion.test.js";
import { TSProjectDestinationQuestionTests } from "./TSProjectDestinationQuestion.test.js";
import { TSProjectDisplayNameQuestionTests } from "./TSProjectDisplayNameQuestion.test.js";
import { TSProjectModuleNameQuestionTests } from "./TSProjectModuleNameQuestion.test.js";
import { TSProjectQuestionCollectionTests } from "./TSProjectQuestionCollection.test.js";

/**
 * Registers tests for inquiry-components for {@link TSProjectGenerator `TSProjectGenerator<TSettings, TOptions>`}s.
 *
 * @param context
 * The test-context.
 */
export function InquiryTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            TSProjectDestinationQuestionTests(context);
            TSProjectDisplayNameQuestionTests(context);
            TSProjectModuleNameQuestionTests(context);
            TSProjectDescriptionQuestionTests(context);
            TSProjectQuestionCollectionTests(context);
        });
}
