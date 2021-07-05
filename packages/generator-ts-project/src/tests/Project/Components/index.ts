import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";
import { TestContext } from "../../TestContext";
import { TSProjectComponentCollectionTests } from "./TSProjectComponentCollection.test";
import { TSProjectGeneralCategoryTests } from "./TSProjectGeneralCategory.test";

/**
 * Registers tests for components for {@link TSProjectGenerator `TSProjectGenerator<TSettings, TOptions>`}s.
 *
 * @param context
 * The test-context.
 */
export function ComponentTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        "Components",
        () =>
        {
            TSProjectGeneralCategoryTests(context);
            TSProjectComponentCollectionTests(context);
        });
}
