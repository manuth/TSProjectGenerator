import { TestContext } from "@manuth/extended-yo-generator-test";
import { TSProjectGenerator } from "../../../../Project/TSProjectGenerator";
import { TSProjectExtensionsMappingTests } from "./TSProjectExtensionsMapping.test";
import { TSProjectLaunchFileMappingTests } from "./TSProjectLaunchFileMapping.test";
import { TSProjectSettingsFileMappingTests } from "./TSProjectSettingsFileMapping.test";
import { TSProjectTasksFileMappingTests } from "./TSProjectTasksFileMapping.test";

/**
 * Registers tests for `VSCode` file-mappings for `TSProject`s.
 *
 * @param context
 * The test-context.
 */
export function VSCodeTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        "VSCode",
        () =>
        {
            TSProjectExtensionsMappingTests(context);
            TSProjectLaunchFileMappingTests(context);
            TSProjectSettingsFileMappingTests(context);
            TSProjectTasksFileMappingTests(context);
        });
}
