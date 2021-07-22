import { GeneratorOptions, IFileMapping, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { FileMappingTester } from "@manuth/extended-yo-generator-test";
import { IParser } from "@manuth/generator-ts-project";
import { readFile } from "fs-extra";

/**
 * Provides the functionality to test a parsable file-mapping.
 *
 * @template TGenerator
 * The type of the generator for testing the file-mapping.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 *
 * @template TFileMapping
 * The type of the file-mapping to test.
 *
 * @template TParsed
 * The type of the parsed representation of the file.
 */
export abstract class ParsableFileMappingTester<TGenerator extends IGenerator<TSettings, TOptions>, TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions, TFileMapping extends IFileMapping<TSettings, TOptions>, TParsed> extends FileMappingTester<TGenerator, TSettings, TOptions, TFileMapping>
{
    /**
     * Initializes a new instance of the {@link ParsableFileMappingTester `ParsableFileMappingTester<TGenerator, TSettings, TOptions, TFileMapping, TParsed>`} class.
     *
     * @param generator
     * The generator of the file-mapping
     *
     * @param fileMapping
     * The file-mapping to test.
     */
    public constructor(generator: TGenerator, fileMapping: TFileMapping)
    {
        super(generator, fileMapping);
    }

    /**
     * Gets the parser of the file-mapping tester.
     */
    public abstract get Parser(): IParser<TParsed>;

    /**
     * Parses the specified {@link text `text`}.
     *
     * @param text
     * The text to parse.
     *
     * @returns
     * The parsed representation of the specified {@link text `text`}.
     */
    public Parse(text: string): TParsed
    {
        return this.Parser.Parse(text);
    }

    /**
     * Parses the source-file.
     *
     * @returns
     * The parsed representation of the source-file.
     */
    public async ParseSource(): Promise<TParsed>
    {
        return this.Parse(await this.ReadSource());
    }

    /**
     * Parses the output-file.
     *
     * @returns
     * The parsed representation of the output-file.
     */
    public async ParseOutput(): Promise<TParsed>
    {
        return this.Parse((await readFile(this.FileMapping.Destination)).toString());
    }
}
