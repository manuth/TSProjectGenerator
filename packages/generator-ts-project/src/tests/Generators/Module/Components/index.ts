import { TSModuleGenerator } from "../../../../generators/module/TSModuleGenerator";
import { TestContext } from "../../../TestContext";
import { TSModuleComponentCollectionTests } from "./TSModuleComponentCollection.test";
import { TSModuleGeneralCategoryTests } from "./TSModuleGeneralCategory.test";

/**
 * Registers tests for the `TSModuleGenerator` components.
 *
 * @param context
 * The test-context.
 */
export function ComponentTests(context: TestContext<TSModuleGenerator>): void
{
    suite(
        "Components",
        () =>
        {
            TSModuleGeneralCategoryTests(context);
            TSModuleComponentCollectionTests(context);
        });
}
