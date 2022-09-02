import { basename } from "path";
import { JSONCConverterTests } from "./JSONCConverter.test.js";
import { PackageJSONConverterTests } from "./PackageJSONConverter.test.js";
import { TypeScriptConverterTests } from "./TypeScriptConverter.test.js";
import { YAMLConverterTests } from "./YAMLConverter.test.js";

/**
 * Registers tests for the conversion-components.
 */
export function ConversionTests(): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            JSONCConverterTests();
            YAMLConverterTests();
            TypeScriptConverterTests();
            PackageJSONConverterTests();
        });
}
