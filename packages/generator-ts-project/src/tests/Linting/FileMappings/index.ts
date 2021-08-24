import { basename } from "path";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";
import { TestContext } from "../../TestContext";
import { ESLintRCFileMappingTests } from "./ESLintRCFileMapping.test";

/**
 * Registers file-mapping components related to linting.
 *
 * @param context
 * The test-context.
 */
export function FileMappingTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        basename(__dirname),
        () =>
        {
            ESLintRCFileMappingTests(context);
        });
}
