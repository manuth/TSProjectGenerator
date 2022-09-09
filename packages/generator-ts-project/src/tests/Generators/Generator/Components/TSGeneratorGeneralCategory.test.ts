import { ok } from "node:assert";
import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { TSGeneratorCodeWorkspaceFolder } from "../../../../generators/generator/Components/TSGeneratorCodeWorkspaceFolder.js";
import { TSGeneratorGeneralCategory } from "../../../../generators/generator/Components/TSGeneratorGeneralCategory.js";
import { ITSGeneratorSettings } from "../../../../generators/generator/Settings/ITSGeneratorSettings.js";
import { TSGeneratorGenerator } from "../../../../generators/generator/TSGeneratorGenerator.js";
import { TestContext } from "../../../TestContext.js";

/**
 * Registers tests for the {@link TSGeneratorGeneralCategory `TSGeneratorGeneralCategory<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function TSGeneratorGeneralCategoryTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        nameof(TSGeneratorGeneralCategory),
        () =>
        {
            let collection: TSGeneratorGeneralCategory<ITSGeneratorSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    collection = new TSGeneratorGeneralCategory(await context.Generator);
                });

            suite(
                nameof<TSGeneratorGeneralCategory<any, any>>((category) => category.Components),
                () =>
                {
                    test(
                        `Checking whether all components for the \`${nameof(TSGeneratorGenerator)}\` are present…`,
                        async () =>
                        {
                            for (let componentType of [TSGeneratorCodeWorkspaceFolder])
                            {
                                ok(collection.Components.some((component) => component instanceof componentType));
                            }
                        });
                });
        });
}
