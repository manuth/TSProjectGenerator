import { basename } from "node:path";
import { TSProjectGenerator } from "../../../../Project/TSProjectGenerator.js";
import { TestContext } from "../../../TestContext.js";
import { TSProjectPackageFileMappingTests } from "./TSProjectPackageFileMapping.test.js";

/**
 * Registers npm-packaging tests for {@link TSProjectGenerator `TSProjectGenerator<TSettings, TOptions>`}s.
 *
 * @param context
 * The test-context.
 */
export function NPMPackagingTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            TSProjectPackageFileMappingTests(context);
        });
}
