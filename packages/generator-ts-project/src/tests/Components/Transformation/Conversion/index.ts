import { basename } from "path";
import { JSONCConverterTests } from "./JSONCConverter.test";
import { YAMLConverterTests } from "./YAMLConverter.test";

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
            YAMLConverterTests();
        });
}
