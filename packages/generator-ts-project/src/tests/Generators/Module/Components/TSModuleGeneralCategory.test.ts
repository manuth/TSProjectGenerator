import { ok } from "assert";
import{ GeneratorOptions } from "@manuth/extended-yo-generator";
import { TSModuleCodeWorkspace } from "../../../../generators/module/Components/TSModuleCodeWorkspace";
import { TSModuleGeneralCategory } from "../../../../generators/module/Components/TSModuleGeneralCategory";
import { TSModuleGenerator } from "../../../../generators/module/TSModuleGenerator";
import { ITSProjectSettings } from "../../../../Project/Settings/ITSProjectSettings";
import { TestContext } from "../../../TestContext";

/**
 * Registers tests for the `TSModuleGeneralCategory` class.
 *
 * @param context
 * The test-context.
 */
export function TSModuleGeneralCategoryTests(context: TestContext<TSModuleGenerator>): void
{
    suite(
        "TSModuleGeneralCategory",
        () =>
        {
            let category: TSModuleGeneralCategory<ITSProjectSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    category = new TSModuleGeneralCategory(await context.Generator);
                });

            test(
                "Checking whether all necessary components are present…",
                () =>
                {
                    for (let componentType of [TSModuleCodeWorkspace])
                    {
                        ok(
                            category.Components.some(
                                (component) =>
                                {
                                    return component instanceof componentType;
                                }));
                    }
                });
        });
}
