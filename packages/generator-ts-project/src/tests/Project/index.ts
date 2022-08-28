import { basename } from "path";
import { TSProjectGenerator } from "../../Project/TSProjectGenerator.js";
import { TestContext } from "../TestContext.js";
import { ComponentTests } from "./Components/index.js";
import { FileMappingTests } from "./FileMappings/index.js";
import { InquiryTests } from "./Inquiry/index.js";
import { TSProjectGeneratorTests } from "./TSProjectGenerator.test.js";
import { VSCodeTests } from "./VSCode/index.js";

/**
 * Registers tests for project-components.
 *
 * @param context
 * The test-context.
 */
export function ProjectTests(context: TestContext<TSProjectGenerator>): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            InquiryTests(context);
            FileMappingTests(context);
            VSCodeTests(context);
            ComponentTests(context);
            TSProjectGeneratorTests(context);
        });
}
