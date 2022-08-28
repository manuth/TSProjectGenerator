import { FileMapping, FileMappingOptions, GeneratorOptions, IFileMapping, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import detectNewline from "detect-newline";
import eol from "eol";

const { split } = eol;

/**
 * Provides the functionality to remove unnecessary blank lines from markdown-files.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class MarkdownFileProcessor<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends FileMappingOptions<TSettings, TOptions>
{
    /**
     * The file-mapping wrapped by this generator.
     */
    private fileMapping: IFileMapping<TSettings, TOptions>;

    /**
     * Initializes a new instance of the {@link MarkdownFileProcessor `MarkdownFileProcessor<TSettings, TOptions>`} class.
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
    public override get Source(): string
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
    public override async Processor(): Promise<void>
    {
        await this.FileMapping.Processor();
        let content = this.Generator.fs.read(this.Destination);
        let eol = detectNewline(content);
        let result: string[];
        let lines = split(content);
        result = [...lines];

        for (let i = lines.length - 1; i >= 0; i--)
        {
            if (
                (i + 2) < lines.length &&
                lines[i].startsWith("#") &&
                (lines[i + 1] === ""))
            {
                result.splice(i + 1, 1);
            }
            else if (
                /^\s*- [^\s]/.test(lines[i]))
            {
                let indent = "  " + lines[i].match(/^(\s*)-/)[1];
                let j = i;

                do
                {
                    if (result[j].length > 0)
                    {
                        result[j] = "  " + result[j];
                    }

                    j++;
                }
                while (
                    j < result.length && (
                        /^(\s*)$/.test(result[j]) || (
                            !/^\s*- [^\s]/.test(result[j]) &&
                            result[j].startsWith(indent))));
            }
        }

        this.WriteOutput(result.join(eol));
    }
}
