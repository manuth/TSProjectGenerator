import { EOL } from "os";
import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import JSON = require("comment-json");
import { split } from "eol";
import { TransformFileMapping } from "./TransformFileMapping";

/**
 * Provides the functionality to transform and copy JSON-code.
 */
export abstract class JSONTransformMapping<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions, TData> extends TransformFileMapping<TSettings, TOptions, TData>
{
    /**
     * Initializes a new instance of the `JSONTransformMapping` class.
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
    protected async Parse(text: string): Promise<TData>
    {
        return JSON.parse(text);
    }

    /**
     * @inheritdoc
     *
     * @param data
     * The data to dump.
     *
     * @returns
     * A text representing the `metadata`.
     */
    protected async Dump(data: TData): Promise<string>
    {
        let text = split(JSON.stringify(data, null, 4)).join(EOL);
        return text + EOL;
    }
}
