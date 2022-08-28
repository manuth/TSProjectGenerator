import { basename } from "path";
import { TSGeneratorGenerator } from "../../../generators/generator/TSGeneratorGenerator.js";
import { TestContext } from "../../TestContext.js";
import { ComponentTests } from "./Components/index.js";
import { FileMappingTests } from "./FileMappings/index.js";
import { InquiryTests } from "./Inquiry/index.js";
import { TSGeneratorGeneratorTests } from "./TSGeneratorGenerator.test.js";
import { VSCodeTests } from "./VSCode/index.js";

/**
 * Registers tests for the {@link TSGeneratorGenerator `TSGeneratorGenerator<TSettings, TOptions>`}.
 *
 * @param context
 * The test-context.
 */
export function GeneratorTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            FileMappingTests(context);
            InquiryTests(context);
            VSCodeTests(context);
            ComponentTests(context);
            TSGeneratorGeneratorTests(context);
        });
}
