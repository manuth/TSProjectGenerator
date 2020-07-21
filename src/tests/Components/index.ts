import { IFileMapping } from "@manuth/extended-yo-generator";
import { TestContext, TestGenerator, ITestOptions, ITestGeneratorOptions } from "@manuth/extended-yo-generator-test";
import { ComponentBase } from "../../Components/ComponentBase";
import { FileMappingConstructor } from "./FileMappingContrsuctor";
import { TransformationTests } from "./Transformation";

/**
 * Registers tests for `Components`.
 *
 * @param context
 * The test-context.
 */
export function ComponentTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "Components",
        () =>
        {
            TransformationTests(context);
        });
}

/**
 * Searches the specified `component` for a file-mapping with the specified type.
 *
 * @param component
 * The component to search.
 *
 * @param fileMappingType
 * The type of file-mapping to find.
 *
 * @returns
 * The file-mapping with the specified type.
 */
export async function GetComponentFileMapping<TFileMapping extends IFileMapping<any>>(component: ComponentBase<any>, fileMappingType: FileMappingConstructor<any>): Promise<TFileMapping>
{
    let fileMapping = (await component.FileMappings).find(
        (fileMapping) =>
        {
            return fileMapping instanceof fileMappingType;
        });

    return fileMapping as any;
}
