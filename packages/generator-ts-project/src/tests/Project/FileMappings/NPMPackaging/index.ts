import { TSProjectGenerator } from "../../../../Project/TSProjectGenerator";
import { TestContext } from "../../../TestContext";
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
