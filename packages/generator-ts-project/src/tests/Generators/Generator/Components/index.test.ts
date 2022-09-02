import { basename } from "node:path";
import { TSGeneratorGenerator } from "../../../../generators/generator/TSGeneratorGenerator.js";
import { TestContext } from "../../../TestContext.js";
import { TSGeneratorCategoryTests } from "./TSGeneratorCategory.test.js";
import { TSGeneratorComponentCollectionTests } from "./TSGeneratorComponentCollection.test.js";
import { TSGeneratorGeneralCategoryTests } from "./TSGeneratorGeneralCategory.test.js";

/**
 * Registers tests for the components of the {@link TSGeneratorGenerator `TSGeneratorGenerator<TSettings, TOptions>`}.
 *
 * @param context
 * The test-context.
 */
export function ComponentTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            TSGeneratorGeneralCategoryTests(context);
            TSGeneratorCategoryTests(context);
            TSGeneratorComponentCollectionTests(context);
        });
}
