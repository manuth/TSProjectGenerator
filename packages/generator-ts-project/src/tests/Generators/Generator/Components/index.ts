import { TSGeneratorGenerator } from "../../../../generators/generator/TSGeneratorGenerator";
import { TestContext } from "../../../TestContext";
import { TSGeneratorComponentCollectionTests } from "./TSGeneratorComponentCollection.test";
import { TSGeneratorGeneralCategoryTests } from "./TSGeneratorGeneralCategory.test";

/**
 * Registers tests for the `Generator`-generator.
 *
 * @param context
 * The test-context.
 */
export function ComponentTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        "Components",
        () =>
        {
            TSGeneratorGeneralCategoryTests(context);
            TSGeneratorComponentCollectionTests(context);
        });
}
