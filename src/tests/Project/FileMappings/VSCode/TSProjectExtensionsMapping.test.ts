import Assert = require("assert");
import { TestContext } from "@manuth/extended-yo-generator-test";
import { TSProjectCodeWorkspaceComponent } from "../../../../Project/Components/TSProjectCodeWorkspaceComponent";
import { TSProjectExtensionsMapping } from "../../../../Project/FileMappings/VSCode/TSProjectExtensionsMapping";
import { ITSProjectSettings } from "../../../../Project/Settings/ITSProjectSettings";
import { TSProjectGenerator } from "../../../../Project/TSProjectGenerator";
import { IExtensionFile } from "../../../../VSCode/IExtensionFile";
import { JSONFileMappingTester } from "../../../Components/JSONFileMappingTester";

/**
 * Registers tests for the `TSProjectExtensionsMapping` class.
 *
 * @param context
 * The test-context.
 */
export function TSProjectExtensionsMappingTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        "TSProjectExtensionsMapping",
        () =>
        {
            let fileMapping: TSProjectExtensionsMapping<ITSProjectSettings>;
            let tester: JSONFileMappingTester<TSProjectGenerator, ITSProjectSettings, TSProjectExtensionsMapping<ITSProjectSettings>>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    fileMapping = new TSProjectExtensionsMapping(new TSProjectCodeWorkspaceComponent(await context.Generator));
                    tester = new JSONFileMappingTester(await context.Generator, fileMapping);
                });

            test(
                "Checking whether unnecessary extensions are filtered…",
                async () =>
                {
                    let extensionsFile: IExtensionFile = await tester.Metadata;
                    Assert.ok(!extensionsFile.recommendations.includes("digitalbrainstem.javascript-ejs-support"));
                });
        });
}
