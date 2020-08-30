import Assert = require("assert");
import dedent = require("dedent");
import { writeFile, readFile } from "fs-extra";
import { TSProjectGenerator } from "../../Project/TSProjectGenerator";
import { TestContext } from "../TestContext";

/**
 * Registers tests for the `TSProjectGenerator` class.
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
            let testCode: string;
            let fileName: string;
            let generator: TSProjectGenerator;

            suiteSetup(
                async function()
                {
                    testCode = dedent(
                        `
                            console.log('hello world');`) + "\n";

                    fileName = "src/test.ts";
                    generator = await context.Generator;
                });

            test(
                "Checking whether the source-code is cleaned up correctly…",
                async function()
                {
                    this.timeout(0);
                    this.slow(45 * 1000);
                    await writeFile(generator.destinationPath(fileName), testCode);
                    await generator.cleanup();
                    Assert.strictEqual((await readFile(generator.destinationPath(fileName))).toString(), testCode.replace(/'/g, '"'));
                });
        });
}
