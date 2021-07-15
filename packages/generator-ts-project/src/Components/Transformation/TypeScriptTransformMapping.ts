import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { SourceFile } from "ts-morph";
import { TextConverter } from "./Conversion/TextConverter";
import { TypeScriptConverter } from "./Conversion/TypeScriptConverter";
import { ParsedFileMapping } from "./ParsedFileMapping";

/**
 * Provides the functionality to transform and copy typescript-files.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export abstract class TypeScriptTransformMapping<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends ParsedFileMapping<TSettings, TOptions, SourceFile>
{
    /**
     * Initializes a new instance of the {@link TypeScriptTransformMapping `TypeScriptTransformMapping<TSettings, TOptions>`} class.
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
     */
     public get Converter(): TextConverter<SourceFile>
     {
         return new TypeScriptConverter(this.Resolved.Destination);
     }
}
