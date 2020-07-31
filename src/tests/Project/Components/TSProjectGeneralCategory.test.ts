import Assert = require("assert");
import { TestContext } from "@manuth/extended-yo-generator-test";
import { TSProjectCodeWorkspaceComponent } from "../../../Project/Components/TSProjectCodeWorkspaceComponent";
import { TSProjectGeneralCategory } from "../../../Project/Components/TSProjectGeneralCategory";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";

/**
 * Registers tests for the `TSProjectGeneralCategory` class.
 *
 * @param context
 * The test-context.
 */
export function TSProjectGeneralCategoryTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        "TSProjectGeneralCategory",
        () =>
        {
            let category: TSProjectGeneralCategory<ITSProjectSettings>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    category = new TSProjectGeneralCategory(await context.Generator);
                });

            test(
                "Checking whether all necessary components are present…",
                () =>
                {
                    for (let componentType of [TSProjectCodeWorkspaceComponent])
                    {
                        Assert.ok(
                            category.Components.some(
                                (component) =>
                                {
                                    return component instanceof componentType;
                                }));
                    }
                });
        });
}
