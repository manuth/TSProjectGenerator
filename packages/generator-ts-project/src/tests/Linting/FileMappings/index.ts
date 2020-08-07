import { TestContext } from "@manuth/extended-yo-generator-test";
import { TSProjectGenerator } from "../../../Project/TSProjectGenerator";
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
        "FileMappings",
        () =>
        {
            ESLintRCFileMappingTests(context);
        });
}
