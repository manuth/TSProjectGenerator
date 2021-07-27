import { basename } from "path";
import { JSONCTransformMappingTests } from "./JSONCTransformMapping.test";
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
            JSONCTransformMappingTests();
            YAMLTransformMappingTests();
            TypeScriptTransformMappingTests();
        });
}
