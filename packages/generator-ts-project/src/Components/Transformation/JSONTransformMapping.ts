import { EOL } from "os";
import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { parse, stringify } from "comment-json";
import { split } from "eol";
import { TransformFileMapping } from "./TransformFileMapping";

/**
 * Provides the functionality to transform and copy JSON-code.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 *
 * @template TData
 * The type of the data to process.
 */
export abstract class JSONTransformMapping<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions, TData> extends TransformFileMapping<TSettings, TOptions, TData>
{
    /**
     * Initializes a new instance of the {@link JSONTransformMapping `JSONTransformMapping<TSettings, TOptions, TData>`} class.
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
    protected async Parse(text: string): Promise<TData>
    {
        return parse(text);
    }

    /**
     * @inheritdoc
     *
     * @param data
     * The data to dump.
     *
     * @returns
     * A text representing the specified {@link data `data`}.
     */
    protected async Dump(data: TData): Promise<string>
    {
        let text = split(stringify(data, null, 4)).join(EOL);
        return text + EOL;
    }
}
