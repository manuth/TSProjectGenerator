import { basename } from "path";
import { TSProjectGenerator } from "../../Project/TSProjectGenerator";
import { TestContext } from "../TestContext";
import { ComponentTests } from "./Components";
import { FileMappingTests } from "./FileMappings";
import { InquiryTests } from "./Inquiry";
import { TSProjectGeneratorTests } from "./TSProjectGenerator.test";
import { VSCodeTests } from "./VSCode";

/**
 * Registers tests for project-components.
 *
 * @param context
 * The test-context.
 */
export function ProjectTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        basename(__dirname),
        () =>
        {
            InquiryTests(context);
            FileMappingTests(context);
            VSCodeTests(context);
            ComponentTests(context);
            TSProjectGeneratorTests(context);
        });
}
