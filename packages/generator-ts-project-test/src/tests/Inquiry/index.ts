import { basename } from "path";
import { TestPromptTests } from "./TestPrompt.test";

/**
 * Registers tests for inquiry-components.
 */
export function InquiryTests(): void
{
    suite(
        basename(__dirname),
        () =>
        {
            TestPromptTests();
        });
}
