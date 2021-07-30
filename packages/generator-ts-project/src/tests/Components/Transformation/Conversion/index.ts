import { basename } from "path";
import { JSONCConverterTests } from "./JSONCConverter.test";

/**
 * Registers tests for the conversion-components.
 */
export function ConversionTests(): void
{
    suite(
        basename(__dirname),
        () =>
        {
            JSONCConverterTests();
        });
}
