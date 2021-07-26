import { basename } from "path";
import { ITestGeneratorOptions, ITestOptions, TestGenerator } from "@manuth/extended-yo-generator-test";
import { TestContext } from "../../TestContext";
import { ScriptMappingTests } from "./ScriptMapping.test";

/**
 * Registers tests for npm-packaging scripts.
 *
 * @param context
 * The test-context.
 */
export function ScriptTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        basename(__dirname),
        () =>
        {
            ScriptMappingTests(context);
        });
}
