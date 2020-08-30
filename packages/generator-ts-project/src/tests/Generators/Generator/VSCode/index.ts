import { TSGeneratorGenerator } from "../../../../generators/generator/TSGeneratorGenerator";
import { TestContext } from "../../../TestContext";
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
