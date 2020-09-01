import { GeneratorOptions, IGeneratorSettings, IFileMapping, IGenerator, FileMapping } from "@manuth/extended-yo-generator";
import { FileMappingBase } from "@manuth/generator-ts-project";
import detectNewLine = require("detect-newline");
import { split } from "eol";

/**
 * Provides the functionality to remove unnecessary blank lines from markdown-files.
 */
export class MarkdownFileProcessor<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends FileMappingBase<TSettings, TOptions>
{
    /**
     * The file-mapping wrapped by this generator.
     */
    private fileMapping: IFileMapping<TSettings, TOptions>;

    /**
     * Initializes a new instance of the `MarkdownFileProcessor` class.
     *
     * @param generator
     * The generator of the file-mapping.
     *
     * @param fileMapping
     * The file-mapping wrapped by this processor.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>, fileMapping: IFileMapping<TSettings, TOptions>)
    {
        super(generator);
        this.fileMapping = fileMapping;
    }

    /**
     * Gets the file-mapping wrapped by this processor.
     */
    public get InnerFileMapping(): IFileMapping<TSettings, TOptions>
    {
        return this.fileMapping;
    }

    /**
     * Gets the resolved representation of the inner file-mapping.
     */
    protected get FileMapping(): FileMapping<TSettings, TOptions>
    {
        return new FileMapping(this.Generator, this.InnerFileMapping);
    }

    /**
     * @inheritdoc
     */
    public get Source(): string
    {
        return this.FileMapping.Source;
    }

    /**
     * @inheritdoc
     */
    public get Destination(): string
    {
        return this.FileMapping.Destination;
    }

    /**
     * @inheritdoc
     */
    public async Processor(): Promise<void>
    {
        await this.FileMapping.Processor();
        let content = this.Generator.fs.read(this.Destination);
        let eol = detectNewLine(content);
        let result: string[];
        let lines = split(content);
        result = [...lines];

        for (let i = lines.length - 3; i >= 0; i--)
        {
            if (
                lines[i].startsWith("#") &&
                (lines[i + 1] === ""))
            {
                result.splice(i + 1, 1);
            }
        }

        this.WriteDestination(result.join(eol));
    }
}
