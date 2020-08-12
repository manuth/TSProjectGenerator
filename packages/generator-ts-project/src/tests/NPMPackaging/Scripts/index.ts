import { TestGenerator, ITestGeneratorOptions, ITestOptions } from "@manuth/extended-yo-generator-test";
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
        "Scripts",
        () =>
        {
            ScriptMappingTests(context);
        });
}
