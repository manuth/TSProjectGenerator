import { basename } from "node:path";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator.js";
import { TestContext } from "../../TestContext.js";
import { ESLintRCFileMappingTests } from "./ESLintRCFileMapping.test.js";

/**
 * Registers file-mapping components related to linting.
 *
 * @param context
 * The test-context.
 */
export function FileMappingTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            ESLintRCFileMappingTests(context);
        });
}
