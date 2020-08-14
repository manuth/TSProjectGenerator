import { IGeneratorSettings, IGenerator } from "@manuth/extended-yo-generator";
import JSON = require("comment-json");
import { TransformFileMapping } from "./TransformFileMapping";

/**
 * Provides the functionality to transform and copy JSON-code.
 */
export abstract class JSONTransformMapping<TData, TSettings extends IGeneratorSettings> extends TransformFileMapping<TData, TSettings>
{
    /**
     * Initializes a new instance of the `JSONTransformMapping` class.
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
        return JSON.parse(text);
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
        return JSON.stringify(metadata);
    }
}
