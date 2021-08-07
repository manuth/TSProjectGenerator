import { basename } from "path";
import { ConversionTests } from "./Conversion";
import { DumpFileMappingTests } from "./DumpFileMapping.test";
import { JSONCTransformMappingTests } from "./JSONCTransformMapping.test";
import { ParsedFileMappingTests } from "./ParsedFileMapping.test";
import { TSConfigFileMappingTests } from "./TSConfigFileMapping.test";
import { TypeScriptTransformMappingTests } from "./TypeScriptTransformMapping.test";
import { YAMLTransformMappingTests } from "./YAMLTransformMapping.test";

/**
 * Registers tests for the transformation-components.
 */
export function TransformationTests(): void
{
    suite(
        basename(__dirname),
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
