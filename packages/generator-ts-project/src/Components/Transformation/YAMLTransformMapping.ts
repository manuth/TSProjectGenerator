import { EOL } from "os";
import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { split } from "eol";
import { Document, parseAllDocuments, scalarOptions } from "yaml";
import { TransformFileMapping } from "./TransformFileMapping";

/**
 * Provides the functionality to transform and copy YAML-code.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export abstract class YAMLTransformMapping<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends TransformFileMapping<TSettings, TOptions, Document.Parsed[]>
{
    /**
     * Initializes a new instance of the {@link YAMLTransformMapping `YAMLTransformMapping<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of the file-mapping.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>)
    {
        super(generator);
    }

    /**
     * @inheritdoc
     *
     * @param text
     * The text representing the meta-data.
     *
     * @returns
     * An object loaded from the specified {@link text `text`}.
     */
    protected async Parse(text: string): Promise<Document.Parsed[]>
    {
        return parseAllDocuments(text);
    }

    /**
     * @inheritdoc
     *
     * @param data
     * The metadata to dump.
     *
     * @returns
     * A text representing the specified {@link data `data`}.
     */
    protected async Dump(data: Document.Parsed[]): Promise<string>
    {
        return split(data.map(
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
            }).join("")).join(EOL);
    }
}
