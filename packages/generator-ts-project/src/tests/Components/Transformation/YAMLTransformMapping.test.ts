import { ITestGeneratorOptions, ITestOptions, TestGenerator } from "@manuth/extended-yo-generator-test";
import { TempFile } from "@manuth/temp-files";
import { writeFile } from "fs-extra";
import { stringify } from "yaml";
import { YAMLTransformMapping } from "../../../Components/Transformation/YAMLTransformMapping";
import { TestContext } from "../../TestContext";

/**
 * Registers tests for the {@link YAMLTransformMapping `YAMLTransformMapping<TSettings, TOptions>`} class.
 *
 * @param context
 * The text-context.
 */
export function YAMLTransformMappingTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        nameof(YAMLTransformMapping),
        () =>
        {
            let sourceFile: TempFile;
            let sourceData: any;

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);
                    sourceFile = new TempFile();
                });

            setup(
                async () =>
                {
                    sourceData = context.RandomObject;
                    await writeFile(sourceFile.FullName, stringify(sourceData));
                });
        });
}
