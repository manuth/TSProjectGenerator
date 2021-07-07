import { ok } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { TSGeneratorCategory } from "../../../../generators/generator/Components/TSGeneratorCategory";
import { TSGeneratorComponentCollection } from "../../../../generators/generator/Components/TSGeneratorComponentCollection";
import { ITSGeneratorSettings } from "../../../../generators/generator/Settings/ITSGeneratorSettings";
import { TSGeneratorGenerator } from "../../../../generators/generator/TSGeneratorGenerator";
import { TestContext } from "../../../TestContext";

/**
 * Registers tests for the {@link TSGeneratorComponentCollection `TSGeneratorComponentCollection<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function TSGeneratorComponentCollectionTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        nameof(TSGeneratorComponentCollection),
        () =>
        {
            let collection: TSGeneratorComponentCollection<ITSGeneratorSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    collection = new TSGeneratorComponentCollection(await context.Generator);
                });

            test(
                `Checking whether all categories for \`${nameof(TSGeneratorGenerator)}\`s are present…`,
                async () =>
                {
                    for (let categoryType of [TSGeneratorCategory])
                    {
                        ok(collection.Categories.some((category) => category instanceof categoryType));
                    }
                });
        });
}
