import { basename } from "path";
import { PromptTests } from "./Prompts/index.test.js";

/**
 * Registers tests for inquiry-components.
 */
export function InquiryTests(): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            PromptTests();
        });
}
