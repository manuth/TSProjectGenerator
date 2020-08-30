import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { TSGeneratorDescriptionQuestion } from "../../../../generators/generator/Inquiry/TSGeneratorDescriptionQuestion";
import { TSGeneratorModuleNameQuestion } from "../../../../generators/generator/Inquiry/TSGeneratorModuleNameQuestion";
import { TSGeneratorQuestionCollection } from "../../../../generators/generator/Inquiry/TSGeneratorQuestionCollection";
import { ITSGeneratorSettings } from "../../../../generators/generator/Settings/ITSGeneratorSettings";
import { TSGeneratorGenerator } from "../../../../generators/generator/TSGeneratorGenerator";
import { TestContext } from "../../../TestContext";

/**
 * Registers tests for the `TSGeneratorQuestionCollection` class.
 *
 * @param context
 * The text-context.
 */
export function TSGeneratorQuestionCollectionTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        "TSGeneratorQuestionCollection",
        () =>
        {
            let collection: TSGeneratorQuestionCollection<ITSGeneratorSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    collection = new TSGeneratorQuestionCollection(await context.Generator);
                });

            test(
                "Checking whether all necessary questions are present…",
                () =>
                {
                    for (let questionType of [TSGeneratorModuleNameQuestion, TSGeneratorDescriptionQuestion])
                    {
                        collection.Questions.some(
                            (question) =>
                            {
                                return question instanceof questionType;
                            });
                    }
                });
        });
}
