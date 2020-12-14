import { ok } from "assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { TSGeneratorCodeWorkspaceFolder } from "../../../../generators/generator/Components/TSGeneratorCodeWorkspaceFolder";
import { TSGeneratorGeneralCategory } from "../../../../generators/generator/Components/TSGeneratorGeneralCategory";
import { ITSGeneratorSettings } from "../../../../generators/generator/Settings/ITSGeneratorSettings";
import { TSGeneratorGenerator } from "../../../../generators/generator/TSGeneratorGenerator";
import { TestContext } from "../../../TestContext";

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
            let collection: TSGeneratorGeneralCategory<ITSGeneratorSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    collection = new TSGeneratorGeneralCategory(await context.Generator);
                });

            test(
                "Checking whether all components for `TSGenerator`s are present…",
                async () =>
                {
                    for (let componentType of [TSGeneratorCodeWorkspaceFolder])
                    {
                        ok(collection.Components.some((component) => component instanceof componentType));
                    }
                });
        });
}
