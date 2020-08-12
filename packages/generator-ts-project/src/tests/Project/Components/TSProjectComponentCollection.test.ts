import Assert = require("assert");
import { TSProjectComponentCollection } from "../../../Project/Components/TSProjectComponentCollection";
import { TSProjectGeneralCategory } from "../../../Project/Components/TSProjectGeneralCategory";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";
import { TestContext } from "../../TestContext";

/**
 * Registers tests for the `TSProjectComponentCollection` class.
 *
 * @param context
 * The test-context.
 */
export function TSProjectComponentCollectionTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        "TSProjectComponentCollection",
        () =>
        {
            let collection: TSProjectComponentCollection<ITSProjectSettings>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    collection = new TSProjectComponentCollection(await context.Generator);
                });

            test(
                "Checking whether all categories for `TSProject`s are present…",
                () =>
                {
                    for (let categoryType of [TSProjectGeneralCategory])
                    {
                        Assert.ok(collection.Categories.some((category) => category instanceof categoryType));
                    }
                });
        });
}
