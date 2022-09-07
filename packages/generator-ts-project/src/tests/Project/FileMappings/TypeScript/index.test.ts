import { basename } from "node:path";
import { TSProjectGenerator } from "../../../../Project/TSProjectGenerator.js";
import { TestContext } from "../../../TestContext.js";
import { ModuleIndexFileMappingTests } from "./ModuleIndexFileMapping.test.js";
import { SuiteFileMappingTests } from "./SuiteFileMapping.test.js";
import { TestFileMappingTests } from "./TestFileMapping.test.js";
import { TSProjectTypeScriptFileMappingTests } from "./TSProjectTypeScriptFileMapping.test.js";

/**
 * Registers tests for the typescript file-mappings.
 *
 * @param context
 * The test-context.
 */
export function TypeScriptTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            TSProjectTypeScriptFileMappingTests(context);
            ModuleIndexFileMappingTests(context);
            SuiteFileMappingTests(context);
            TestFileMappingTests(context);
        });
}
