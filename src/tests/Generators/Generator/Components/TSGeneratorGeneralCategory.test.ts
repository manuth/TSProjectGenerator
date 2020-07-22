import Assert = require("assert");
import { TestContext } from "@manuth/extended-yo-generator-test";
import { TSGeneratorCodeWorkspace } from "../../../../generators/generator/Components/TSGeneratorCodeWorkspace";
import { TSGeneratorGeneralCategory } from "../../../../generators/generator/Components/TSGeneratorGeneralCategory";
import { ITSGeneratorSettings } from "../../../../generators/generator/Settings/ITSGeneratorSettings";
import { TSGeneratorComponent } from "../../../../generators/generator/Settings/TSGeneratorComponent";
import { TSGeneratorGenerator } from "../../../../generators/generator/TSGeneratorGenerator";

/**
 * Registers tests for the `TSGeneratorGeneralCategory` class.
 *
 * @param context
 * The test-context.
 */
export function TSGeneratorGeneralCategoryTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        "TSGeneratorGeneralCategory",
        () =>
        {
            let collection: TSGeneratorGeneralCategory<ITSGeneratorSettings>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    collection = new TSGeneratorGeneralCategory(await context.Generator);
                });

            test(
                "Checking whether all categories for `TSGenerator`s are present…",
                async () =>
                {
                    for (let componentType of [TSGeneratorCodeWorkspace])
                    {
                        Assert.ok((collection.Components).some((component) => component instanceof componentType));
                    }

                    for (let componentID of [TSGeneratorComponent.GeneratorExample, TSGeneratorComponent.SubGeneratorExample])
                    {
                        Assert.ok((collection.Components).some((component) => component.ID === componentID));
                    }
                });
        });
}
