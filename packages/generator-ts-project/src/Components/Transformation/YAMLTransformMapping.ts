import { IGeneratorSettings, IGenerator } from "@manuth/extended-yo-generator";
import { safeDump, safeLoadAll } from "js-yaml";
import { TransformFileMapping } from "./TransformFileMapping";

/**
 * Provides the functionality to transform and copy YAML-code.
 */
export abstract class YAMLTransformMapping<TData extends any[], TSettings extends IGeneratorSettings> extends TransformFileMapping<TData, TSettings>
{
    /**
     * Initializes a new instance of the `YAMLTransformMapping` class.
     *
     * @param generator
     * The generator of the file-mapping.
     */
    public constructor(generator: IGenerator<TSettings>)
    {
        super(generator);
    }

    /**
     * Loads the meta-data from the `text`.
     *
     * @param text
     * The text representing the meta-data.
     *
     * @returns
     * An object loaded from the `text`.
     */
    protected async Parse(text: string): Promise<TData>
    {
        return safeLoadAll(text) as TData;
    }

    /**
     * @inheritdoc
     *
     * @param metadata
     * The metadata to dump.
     *
     * @returns
     * A text representing the `metadata`.
     */
    protected async Dump(metadata: TData): Promise<string>
    {
        return metadata.map((document) => safeDump(document)).join("---\n");
    }
}
