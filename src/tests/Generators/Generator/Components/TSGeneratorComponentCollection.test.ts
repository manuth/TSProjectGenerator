import Assert = require("assert");
import { TestContext } from "@manuth/extended-yo-generator-test";
import { TSGeneratorComponentCollection } from "../../../../generators/generator/Components/TSGeneratorComponentCollection";
import { TSGeneratorGeneralCategory } from "../../../../generators/generator/Components/TSGeneratorGeneralCategory";
import { ITSGeneratorSettings } from "../../../../generators/generator/Settings/ITSGeneratorSettings";
import { TSGeneratorGenerator } from "../../../../generators/generator/TSGeneratorGenerator";

/**
 * Registers tests for the `TSGeneratorComponentCollection` class.
 *
 * @param context
 * The test-context.
 */
export function TSGeneratorComponentCollectionTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        "TSGeneratorComponentCollection",
        () =>
        {
            let collection: TSGeneratorComponentCollection<ITSGeneratorSettings>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    collection = new TSGeneratorComponentCollection(await context.Generator);
                });

            test(
                "Checking whether all categories for `TSGenerator`s are present…",
                async () =>
                {
                    for (let categoryType of [TSGeneratorGeneralCategory])
                    {
                        Assert.ok(collection.Categories.some((category) => category instanceof categoryType));
                    }
                });
        });
}
