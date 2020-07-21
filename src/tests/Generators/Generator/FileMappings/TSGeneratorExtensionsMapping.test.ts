import Assert = require("assert");
import { FileMapping } from "@manuth/extended-yo-generator";
import { TestContext } from "@manuth/extended-yo-generator-test";
import JSON = require("comment-json");
import { readFile } from "fs-extra";
import { TSGeneratorCodeWorkspace } from "../../../../generators/generator/Components/TSGeneratorCodeWorkspace";
import { TSGeneratorExtensionsMapping } from "../../../../generators/generator/FileMappings/VSCode/TSGeneratorExtensionsMapping";
import { ITSGeneratorSettings } from "../../../../generators/generator/Settings/ITSGeneratorSettings";
import { TSGeneratorGenerator } from "../../../../generators/generator/TSGeneratorGenerator";
import { GetComponentFileMapping } from "../../../Components";

/**
 * Registers tests for the `TSGeneratorExtensionsMapping` class.
 *
 * @param context
 * The test-context.
 */
export function TSGeneratorExtensionsMappingTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite.only(
        "TSGeneratorExtensionsMapping",
        () =>
        {
            let fileMappingOptions: TSGeneratorExtensionsMapping<ITSGeneratorSettings>;
            let fileMapping: FileMapping<ITSGeneratorSettings>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);
                    fileMappingOptions = await GetComponentFileMapping(
                        await context.Generator,
                        new TSGeneratorCodeWorkspace(),
                        TSGeneratorExtensionsMapping);

                    fileMapping = new FileMapping(await context.Generator, fileMappingOptions);
                });

            test(
                "Checking whether all recommendations are preserved…",
                async () =>
                {
                    Assert.deepStrictEqual(
                        JSON.parse((await readFile(await fileMapping.Destination)).toString()),
                        JSON.parse((await readFile(await fileMapping.Source)).toString()));
                });
        });
}
