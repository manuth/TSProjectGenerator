import { basename } from "path";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator.js";
import { TestContext } from "../../TestContext.js";
import { TSProjectComponentCollectionTests } from "./TSProjectComponentCollection.test.js";
import { TSProjectGeneralCategoryTests } from "./TSProjectGeneralCategory.test.js";

/**
 * Registers tests for components for {@link TSProjectGenerator `TSProjectGenerator<TSettings, TOptions>`}s.
 *
 * @param context
 * The test-context.
 */
export function ComponentTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            TSProjectGeneralCategoryTests(context);
            TSProjectComponentCollectionTests(context);
        });
}
