import { ok } from "node:assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { TSProjectDescriptionQuestion } from "../../../Project/Inquiry/TSProjectDescriptionQuestion.js";
import { TSProjectDestinationQuestion } from "../../../Project/Inquiry/TSProjectDestinationQuestion.js";
import { TSProjectDisplayNameQuestion } from "../../../Project/Inquiry/TSProjectDisplayNameQuestion.js";
import { TSProjectModuleNameQuestion } from "../../../Project/Inquiry/TSProjectModuleNameQuestion.js";
import { TSProjectQuestionCollection } from "../../../Project/Inquiry/TSProjectQuestionCollection.js";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings.js";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator.js";
import { TestContext } from "../../TestContext.js";

/**
 * Registers tests for the {@link TSProjectQuestionCollection `TSProjectQuestionCollection<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function TSProjectQuestionCollectionTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        nameof(TSProjectQuestionCollection),
        () =>
        {
            let questionCollection: TSProjectQuestionCollection<ITSProjectSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    questionCollection = new TSProjectQuestionCollection(await context.Generator);
                });

            suite(
                nameof<TSProjectQuestionCollection<any, any>>((question) => question.Questions),
                () =>
                {
                    test(
                        "Checking whether all necessary questions are present…",
                        () =>
                        {
                            let questionTypes = [
                                TSProjectDestinationQuestion,
                                TSProjectDisplayNameQuestion,
                                TSProjectModuleNameQuestion,
                                TSProjectDescriptionQuestion
                            ];

                            for (let questionType of questionTypes)
                            {
                                ok(
                                    questionCollection.Questions.some(
                                        (question) => question instanceof questionType));
                            }
                        });
                });
        });
}
