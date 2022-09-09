import { ok } from "node:assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { TSProjectComponentCollection } from "../../../Project/Components/TSProjectComponentCollection.js";
import { TSProjectGeneralCategory } from "../../../Project/Components/TSProjectGeneralCategory.js";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings.js";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator.js";
import { TestContext } from "../../TestContext.js";

/**
 * Registers tests for the {@link TSProjectComponentCollection `TSProjectComponentCollection<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function TSProjectComponentCollectionTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        nameof(TSProjectComponentCollection),
        () =>
        {
            let collection: TSProjectComponentCollection<ITSProjectSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    collection = new TSProjectComponentCollection(await context.Generator);
                });

            suite(
                nameof<TSProjectComponentCollection<any, any>>((collection) => collection.Categories),
                () =>
                {
                    test(
                        `Checking whether all categories for the \`${nameof(TSProjectGenerator)}\` are present…`,
                        () =>
                        {
                            for (let categoryType of [TSProjectGeneralCategory])
                            {
                                ok(collection.Categories.some((category) => category instanceof categoryType));
                            }
                        });
                });
        });
}
