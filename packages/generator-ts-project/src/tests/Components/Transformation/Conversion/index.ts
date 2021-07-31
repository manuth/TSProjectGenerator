import { basename } from "path";
import { JSONCConverterTests } from "./JSONCConverter.test";
import { PackageJSONConverterTests } from "./PackageJSONConverter.test";
import { TypeScriptConverterTests } from "./TypeScriptConverter.test";
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
            TypeScriptConverterTests();
            PackageJSONConverterTests();
        });
}
