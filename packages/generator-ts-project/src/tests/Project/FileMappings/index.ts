import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";
import { TestContext } from "../../TestContext";
import { GitIgnoreFileMappingTests } from "./GitIgnoreFileMapping.test";
import { NPMIgnoreFileMappingTests } from "./NPMIgnoreFileMapping.test";
import { NPMPackagingTests } from "./NPMPackaging";

/**
 * Registers tests for `TSProject` file-mappings.
 *
 * @param context
 * The test-context.
 */
export function FileMappingTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        "FileMappings",
        () =>
        {
            GitIgnoreFileMappingTests(context);
            NPMIgnoreFileMappingTests(context);
            NPMPackagingTests(context);
        });
}
