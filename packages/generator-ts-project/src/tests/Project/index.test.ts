import { basename } from "node:path";
import { TSProjectGenerator } from "../../Project/TSProjectGenerator.js";
import { TestContext } from "../TestContext.js";
import { ComponentTests } from "./Components/index.test.js";
import { FileMappingTests } from "./FileMappings/index.test.js";
import { InquiryTests } from "./Inquiry/index.test.js";
import { TSProjectGeneratorTests } from "./TSProjectGenerator.test.js";
import { VSCodeTests } from "./VSCode/index.test.js";

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
