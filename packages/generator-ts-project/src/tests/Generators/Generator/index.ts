import { basename } from "path";
import { TSGeneratorGenerator } from "../../../generators/generator/TSGeneratorGenerator";
import { TestContext } from "../../TestContext";
import { ComponentTests } from "./Components";
import { FileMappingTests } from "./FileMappings";
import { InquiryTests } from "./Inquiry";
import { TSGeneratorGeneratorTests } from "./TSGeneratorGenerator.test";
import { VSCodeTests } from "./VSCode";

/**
 * Registers tests for the {@link TSGeneratorGenerator `TSGeneratorGenerator<TSettings, TOptions>`}.
 *
 * @param context
 * The test-context.
 */
export function GeneratorTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        basename(__dirname),
        () =>
        {
            FileMappingTests(context);
            InquiryTests(context);
            VSCodeTests(context);
            ComponentTests(context);
            TSGeneratorGeneratorTests(context);
        });
}
