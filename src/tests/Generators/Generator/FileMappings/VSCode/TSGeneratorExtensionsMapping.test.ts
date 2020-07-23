import Assert = require("assert");
import { TestContext } from "@manuth/extended-yo-generator-test";
import JSON = require("comment-json");
import { readFile } from "fs-extra";
import { TSGeneratorCodeWorkspace } from "../../../../../generators/generator/Components/TSGeneratorCodeWorkspace";
import { TSGeneratorExtensionsMapping } from "../../../../../generators/generator/FileMappings/VSCode/TSGeneratorExtensionsMapping";
import { ITSGeneratorSettings } from "../../../../../generators/generator/Settings/ITSGeneratorSettings";
import { TSGeneratorGenerator } from "../../../../../generators/generator/TSGeneratorGenerator";
import { JSONFileMappingTester } from "../../../../Components/JSONFileMappingTester";

/**
 * Registers tests for the `TSGeneratorExtensionsMapping` class.
 *
 * @param context
 * The test-context.
 */
export function TSGeneratorExtensionsMappingTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        "TSGeneratorExtensionsMapping",
        () =>
        {
            let fileMapping: TSGeneratorExtensionsMapping<ITSGeneratorSettings>;
            let tester: JSONFileMappingTester<TSGeneratorGenerator, ITSGeneratorSettings, TSGeneratorExtensionsMapping<ITSGeneratorSettings>>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    fileMapping = new TSGeneratorExtensionsMapping(new TSGeneratorCodeWorkspace(await context.Generator));
                    tester = new JSONFileMappingTester(await context.Generator, fileMapping);
                });

            test(
                "Checking whether all recommendations are preserved…",
                async () =>
                {
                    Assert.deepStrictEqual(
                        JSON.parse((await readFile(await tester.FileMapping.Destination)).toString()),
                        JSON.parse((await readFile(await tester.FileMapping.Source)).toString()));
                });
        });
}
