import { TestContext } from "@manuth/extended-yo-generator-test";
import { TSGeneratorGenerator } from "../../../../generators/generator/TSGeneratorGenerator";
import { TSGeneratorLaunchFileProcessorTests } from "./TSGeneratorLaunchFileProcessor.test";

/**
 * Registers tests for VSCode-components for `TSGenerator`s.
 *
 * @param context
 * The test-context.
 */
export function VSCodeTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        "VSCode",
        () =>
        {
            TSGeneratorLaunchFileProcessorTests(context);
        });
}
