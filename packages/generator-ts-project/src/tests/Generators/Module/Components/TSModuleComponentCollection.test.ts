import Assert = require("assert");
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { ITSProjectSettings } from "../../../../Project/Settings/ITSProjectSettings";
import { TSModuleComponentCollection } from "../../../../generators/module/Components/TSModuleComponentCollection";
import { TSModuleGeneralCategory } from "../../../../generators/module/Components/TSModuleGeneralCategory";
import { TSModuleGenerator } from "../../../../generators/module/TSModuleGenerator";
import { TestContext } from "../../../TestContext";

/**
 * Registers tests for the `TSModuleComponentCollection` class.
 *
 * @param context
 * The test-context.
 */
export function TSModuleComponentCollectionTests(context: TestContext<TSModuleGenerator>): void
{
    suite(
        "TSModuleComponentCollection",
        () =>
        {
            let collection: TSModuleComponentCollection<ITSProjectSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    collection = new TSModuleComponentCollection(await context.Generator);
                });

            test(
                "Checking whether all necessary component-categories are present…",
                () =>
                {
                    for (let categoryType of [TSModuleGeneralCategory])
                    {
                        Assert.ok(
                            collection.Categories.some(
                                (category) =>
                                {
                                    return category instanceof categoryType;
                                }));
                    }
                });
        });
}
