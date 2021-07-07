import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { TSGeneratorDescriptionQuestion } from "../../../../generators/generator/Inquiry/TSGeneratorDescriptionQuestion";
import { TSGeneratorModuleNameQuestion } from "../../../../generators/generator/Inquiry/TSGeneratorModuleNameQuestion";
import { TSGeneratorQuestionCollection } from "../../../../generators/generator/Inquiry/TSGeneratorQuestionCollection";
import { ITSGeneratorSettings } from "../../../../generators/generator/Settings/ITSGeneratorSettings";
import { TSGeneratorGenerator } from "../../../../generators/generator/TSGeneratorGenerator";
import { TestContext } from "../../../TestContext";

/**
 * Registers tests for the {@link TSGeneratorQuestionCollection `TSGeneratorQuestionCollection<TSettings, TOptions>`} class.
 *
 * @param context
 * The text-context.
 */
export function TSGeneratorQuestionCollectionTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        nameof(TSGeneratorQuestionCollection),
        () =>
        {
            let collection: TSGeneratorQuestionCollection<ITSGeneratorSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    collection = new TSGeneratorQuestionCollection(await context.Generator);
                });

            suite(
                nameof<TSGeneratorQuestionCollection<any, any>>((collection) => collection.Questions),
                () =>
                {
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
        });
}
