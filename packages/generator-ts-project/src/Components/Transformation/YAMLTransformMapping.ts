import { IGeneratorSettings, IGenerator } from "@manuth/extended-yo-generator";
import { parseAllDocuments, Document } from "yaml";
import { TransformFileMapping } from "./TransformFileMapping";

/**
 * Provides the functionality to transform and copy YAML-code.
 */
export abstract class YAMLTransformMapping<TSettings extends IGeneratorSettings> extends TransformFileMapping<TSettings, Document.Parsed[]>
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
    protected async Parse(text: string): Promise<Document.Parsed[]>
    {
        return parseAllDocuments(text);
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
    protected async Dump(metadata: Document.Parsed[]): Promise<string>
    {
        return metadata.map((document) => document.toString()).join("---\n");
    }
}
