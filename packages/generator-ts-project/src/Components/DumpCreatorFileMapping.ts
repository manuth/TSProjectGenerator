import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { DumpFileMapping } from "./Transformation/DumpFileMapping";

/**
 * Provides the functionality to create dumps from existing data.
 */
export abstract class DumpCreatorFileMapping<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions, TData> extends DumpFileMapping<TSettings, TOptions, TData>
{
    /**
     * The name of the file to write the dump to.
     */
    private destination: string;

    /**
     * The data to dump.
     */
    private data: TData;

    /**
     * Initializes a new instance of the {@link DumpCreatorFileMapping `DumpCreatorFileMapping<TSettings, TOptions, TData>`} class.
     *
     * @param generator
     * The generator of the file-mapping.
     *
     * @param fileName
     * The name of the file to write the dump to.
     *
     * @param data
     * The data to dump.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>, fileName: string, data: TData)
    {
        super(generator);
        this.destination = fileName;
        this.data = data;
    }

    /**
     * @inheritdoc
     */
    public override get SourceObject(): Promise<TData>
    {
        return (
            async () =>
            {
                return this.data;
            })();
    }

    /**
     * @inheritdoc
     */
    public get Destination(): string
    {
        return this.destination;
    }
}
