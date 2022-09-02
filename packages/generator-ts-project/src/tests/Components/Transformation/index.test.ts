import { basename } from "path";
import { ConversionTests } from "./Conversion/index.test.js";
import { DumpFileMappingTests } from "./DumpFileMapping.test.js";
import { JSONCTransformMappingTests } from "./JSONCTransformMapping.test.js";
import { ParsedFileMappingTests } from "./ParsedFileMapping.test.js";
import { TSConfigFileMappingTests } from "./TSConfigFileMapping.test.js";
import { TypeScriptTransformMappingTests } from "./TypeScriptTransformMapping.test.js";
import { YAMLTransformMappingTests } from "./YAMLTransformMapping.test.js";

/**
 * Registers tests for the transformation-components.
 */
export function TransformationTests(): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            ConversionTests();
            DumpFileMappingTests();
            ParsedFileMappingTests();
            JSONCTransformMappingTests();
            YAMLTransformMappingTests();
            TypeScriptTransformMappingTests();
            TSConfigFileMappingTests();
        });
}
