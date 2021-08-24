import { basename } from "path";
import { PromptTests } from "./Prompts";

/**
 * Registers tests for inquiry-components.
 */
export function InquiryTests(): void
{
    suite(
        basename(__dirname),
        () =>
        {
            PromptTests();
        });
}
