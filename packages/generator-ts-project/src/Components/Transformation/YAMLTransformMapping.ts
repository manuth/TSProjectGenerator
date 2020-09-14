import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { Document, parseAllDocuments, scalarOptions } from "yaml";
import { TransformFileMapping } from "./TransformFileMapping";

/**
 * Provides the functionality to transform and copy YAML-code.
 */
export abstract class YAMLTransformMapping<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends TransformFileMapping<TSettings, TOptions, Document.Parsed[]>
{
    /**
     * Initializes a new instance of the `YAMLTransformMapping` class.
     *
     * @param generator
     * The generator of the file-mapping.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>)
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
        return metadata.map(
            (document, index) =>
            {
                let initialWidth = scalarOptions.str.fold.lineWidth;
                scalarOptions.str.fold.lineWidth = 0;

                try
                {
                    document.directivesEndMarker = document.directivesEndMarker || (index > 0);
                    return document.toString();
                }
                catch (e)
                {
                    throw e;
                }
                finally
                {
                    scalarOptions.str.fold.lineWidth = initialWidth;
                }
            }).join("");
    }
}
