import { basename } from "path";
import { TSProjectGenerator } from "../../../../Project/TSProjectGenerator";
import { TestContext } from "../../../TestContext";
import { TSProjectPackageFileMappingTests } from "./TSProjectPackageFileMapping.test";

/**
 * Registers npm-packaging tests for {@link TSProjectGenerator `TSProjectGenerator<TSettings, TOptions>`}s.
 *
 * @param context
 * The test-context.
 */
export function NPMPackagingTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        basename(__dirname),
        () =>
        {
            TSProjectPackageFileMappingTests(context);
        });
}
