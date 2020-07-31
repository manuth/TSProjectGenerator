import { TestContext } from "@manuth/extended-yo-generator-test";
import { TSProjectGenerator } from "../../../../Project/TSProjectGenerator";
import { TSProjectPackageFileMappingTests } from "./TSProjectPackageFileMapping.test";

/**
 * Registers npm-packaging tests for `TSProject`s.
 *
 * @param context
 * The test-context.
 */
export function NPMPackagingTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        "NPMPackaging",
        () =>
        {
            TSProjectPackageFileMappingTests(context);
        });
}
