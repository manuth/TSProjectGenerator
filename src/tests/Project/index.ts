import { TestContext } from "@manuth/extended-yo-generator-test";
import { TSProjectGenerator } from "../../Project/TSProjectGenerator";
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
        "Project",
        () =>
        {
            InquiryTests(context);
            FileMappingTests(context);
            VSCodeTests(context);
            ComponentTests(context);
            TSProjectGeneratorTests(context);
        });
}
