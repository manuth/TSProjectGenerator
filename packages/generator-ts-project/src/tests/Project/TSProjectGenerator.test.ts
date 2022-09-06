import { strictEqual } from "node:assert";
import dedent from "dedent";
import fs from "fs-extra";
import { TSConfigJSON } from "types-tsconfig";
import { TSConfigFileMapping } from "../../Components/Transformation/TSConfigFileMapping.js";
import { TSProjectGenerator } from "../../Project/TSProjectGenerator.js";
import { TestContext } from "../TestContext.js";

const { readFile, readJSON, writeFile } = fs;

/**
 * Registers tests for the {@link TSProjectGenerator `TSProjectGenerator<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function TSProjectGeneratorTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        nameof(TSProjectGenerator),
        () =>
        {
            let tsConfigFileName = TSConfigFileMapping.GetFileName("base");
            let transformName = "ts-nameof";
            let testCode: string;
            let testFileName: string;
            let generator: TSProjectGenerator;
            context.RegisterCleanupRestorer();

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);

                    testCode = dedent(
                        `
                            console.log('hello world');`) + "\n";

                    testFileName = "src/test.ts";
                    generator = await context.Generator;
                });

            suite(
                "General",
                () =>
                {
                    test(
                        `Checking whether the \`${transformName}\`-plugin is stripped from \`${tsConfigFileName}\`…`,
                        async () =>
                        {
                            let tsConfig = await readJSON(generator.destinationPath(tsConfigFileName)) as TSConfigJSON;

                            strictEqual(
                                tsConfig.compilerOptions.plugins.filter(
                                    (plugin) =>
                                    {
                                        return plugin.transform === transformName;
                                    }).length,
                                0);
                        });

                    test(
                        "Checking whether the source-code is cleaned up correctly…",
                        async function()
                        {
                            this.timeout(15 * 60 * 1000);
                            this.slow(7.5 * 60 * 1000);
                            await writeFile(generator.destinationPath(testFileName), testCode);
                            await generator.cleanup();
                            strictEqual((await readFile(generator.destinationPath(testFileName))).toString(), testCode.replace(/'/g, '"'));
                        });
                });
        });
}
