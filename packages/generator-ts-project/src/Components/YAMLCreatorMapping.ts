import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { Document } from "yaml";
import { YAMLTransformMapping } from "./Transformation/YAMLTransformMapping";

/**
 * Provides the functionality to create yaml-files.
 */
export class YAMLCreatorMapping<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends YAMLTransformMapping<TSettings, TOptions>
{
    /**
     * The data to write.
     */
    private data: Document[];

    /**
     * The destination to save the file to.
     */
    private destination: string;

    /**
     * Initializes a new instance of the `YAMLCreatorMapping` class.
     *
     * @param generator
     * The generator of this file-mapping.
     *
     * @param fileName
     * The name of the file to write the json-file to.
     *
     * @param data
     * The data to write to the file.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>, fileName: string, data: Document[])
    {
        super(generator);
        this.destination = fileName;
        this.data = data;
    }

    /**
     * @inheritdoc
     */
    public get Source(): string
    {
        return null;
    }

    /**
     * @inheritdoc
     */
    public get Destination(): string
    {
        return this.destination;
    }

    /**
     * @inheritdoc
     */
    public override get Metadata(): Promise<Document.Parsed[]>
    {
        return this.Parse(this.data.map(
            (document) => document.toString()).join(""));
    }
}
