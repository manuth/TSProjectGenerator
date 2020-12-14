import { ITestGeneratorOptions, ITestOptions, TestGenerator } from "@manuth/extended-yo-generator-test";
import { TestContext } from "../TestContext";
import { DependencyTests } from "./Dependencies";
import { FileMappingTests } from "./FileMappings";
import { ScriptMappingTests } from "./Scripts/ScriptMapping.test";

/**
 * Registers tests for npm-packaging components.
 *
 * @param context
 * The test-context.
 */
export function NPMPackagingTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "NPMPackaging",
        () =>
        {
            DependencyTests(context);
            ScriptMappingTests(context);
            FileMappingTests(context);
        });
}
