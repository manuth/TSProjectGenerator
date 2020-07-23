import { TestContext } from "@manuth/extended-yo-generator-test";
import { TSModuleGenerator } from "../../../../generators/module/TSModuleGenerator";
import { TSModuleCodeWorkspaceTests } from "./TSModuleCodeWorkspace.test";
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
            TSModuleCodeWorkspaceTests(context);
            TSModuleGeneralCategoryTests(context);
            TSModuleComponentCollectionTests(context);
        });
}
