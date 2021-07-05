import { strictEqual } from "assert";
import dedent = require("dedent");
import { readFile, writeFile } from "fs-extra";
import { TSProjectGenerator } from "../../Project/TSProjectGenerator";
import { TestContext } from "../TestContext";

/**
 * Registers tests for the {@link TSProjectGenerator `TSProjectGenerator<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function TSProjectGeneratorTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        "TSProjectGenerator",
        () =>
        {
            let tsConfigFileName = "tsconfig.base.json";
            let transformName = "ts-nameof";
            let testCode: string;
            let fileName: string;
            let generator: TSProjectGenerator;

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);

                    testCode = dedent(
                        `
                            console.log('hello world');`) + "\n";

                    fileName = "src/test.ts";
                    generator = await context.Generator;
                });

            test(
                `Checking whether the \`${transformName}\`-plugin is stripped from \`${tsConfigFileName}\`…`,
                () =>
                {
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    let tsConfig = require(generator.destinationPath("tsconfig.base.json"));

                    strictEqual(
                        (tsConfig.compilerOptions.plugins as any[]).filter(
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
                    await writeFile(generator.destinationPath(fileName), testCode);
                    await generator.cleanup();
                    strictEqual((await readFile(generator.destinationPath(fileName))).toString(), testCode.replace(/'/g, '"'));
                });
        });
}
