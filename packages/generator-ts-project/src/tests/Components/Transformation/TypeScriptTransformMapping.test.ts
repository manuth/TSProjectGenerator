import { ITestGeneratorOptions, ITestOptions, TestGenerator } from "@manuth/extended-yo-generator-test";
import { TempFile } from "@manuth/temp-files";
import dedent = require("dedent");
import { writeFile } from "fs-extra";
import { TypeScriptTransformMapping } from "../../../Components/Transformation/TypeScriptTransformMapping";
import { TestContext } from "../../TestContext";

/**
 * Registers tests for the {@link TypeScriptTransformMapping `TypeScriptTransformMapping<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function TypeScriptTransformMappingTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        nameof(TypeScriptTransformMapping),
        () =>
        {
            let sourceFile: TempFile;
            let sourceCode: string;

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    sourceFile = new TempFile();

                    sourceCode = dedent(
                        `
                            var a = 12;

                            var b = 13;`);

                    await writeFile(sourceFile.FullName, sourceCode);
                });
        });
}
