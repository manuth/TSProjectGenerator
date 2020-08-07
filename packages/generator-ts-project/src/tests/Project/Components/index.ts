import { TestContext } from "@manuth/extended-yo-generator-test";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";
import { TSProjectComponentCollectionTests } from "./TSProjectComponentCollection.test";
import { TSProjectGeneralCategoryTests } from "./TSProjectGeneralCategory.test";

/**
 * Registers tests for components for `TSProject` generators.
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
