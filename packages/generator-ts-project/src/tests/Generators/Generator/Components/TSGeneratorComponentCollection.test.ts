import Assert = require("assert");
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { TSGeneratorCategory } from "../../../../generators/generator/Components/TSGeneratorCategory";
import { TSGeneratorComponentCollection } from "../../../../generators/generator/Components/TSGeneratorComponentCollection";
import { ITSGeneratorSettings } from "../../../../generators/generator/Settings/ITSGeneratorSettings";
import { TSGeneratorGenerator } from "../../../../generators/generator/TSGeneratorGenerator";
import { TestContext } from "../../../TestContext";

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
            let collection: TSGeneratorComponentCollection<ITSGeneratorSettings, GeneratorOptions>;

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
                    for (let categoryType of [TSGeneratorCategory])
                    {
                        Assert.ok(collection.Categories.some((category) => category instanceof categoryType));
                    }
                });
        });
}
