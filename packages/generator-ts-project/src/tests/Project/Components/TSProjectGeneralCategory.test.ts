import { ok } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { TSProjectCodeWorkspaceFolder } from "../../../Project/Components/TSProjectCodeWorkspaceFolder";
import { TSProjectGeneralCategory } from "../../../Project/Components/TSProjectGeneralCategory";
import { ITSProjectSettings } from "../../../Project/Settings/ITSProjectSettings";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";
import { TestContext } from "../../TestContext";

/**
 * Registers tests for the {@link TSProjectGeneralCategory `TSProjectGeneralCategory<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function TSProjectGeneralCategoryTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        nameof(TSProjectGeneralCategory),
        () =>
        {
            let category: TSProjectGeneralCategory<ITSProjectSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    category = new TSProjectGeneralCategory(await context.Generator);
                });

            suite(
                nameof<TSProjectGeneralCategory<any, any>>((category) => category.Components),
                () =>
                {
                    test(
                        "Checking whether all necessary components are present…",
                        () =>
                        {
                            for (let componentType of [TSProjectCodeWorkspaceFolder])
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
        });
}
