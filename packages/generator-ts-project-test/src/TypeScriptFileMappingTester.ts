import { parse } from "path";
import { GeneratorOptions, IFileMapping, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { TextConverter, TypeScriptConverter } from "@manuth/generator-ts-project";
import { TempDirectory } from "@manuth/temp-files";
import { SourceFile } from "ts-morph";
import { ConvertibleFileMappingTester } from "./ConvertibleFileMappingTester";

/**
 * Provides the functionality to test typescript file-mappings.
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
 */
export class TypeScriptFileMappingTester<TGenerator extends IGenerator<TSettings, TOptions>, TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions, TFileMapping extends IFileMapping<TSettings, TOptions>> extends ConvertibleFileMappingTester<TGenerator, TSettings, TOptions, TFileMapping, SourceFile>
{
    /**
     * Initializes a new instance of the {@link TypeScriptFileMappingTester `TypeScriptFileMappingTester<TGenerator, TSettings, TOptions, TFileMapping>`} class.
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
     * @inheritdoc
     */
    public get Converter(): TextConverter<SourceFile>
    {
        return new TypeScriptConverter(this.FileMapping.Destination);
    }

    /**
     * Requires the output-file.
     *
     * @returns
     * The result of the {@link require `require`}-call.
     */
    public async Require(): Promise<any>
    {
        let tempDir = new TempDirectory();
        let sourceFile = await this.ParseOutput();
        let project = sourceFile.getProject();

        sourceFile.getProject().compilerOptions.set(
            {
                outDir: tempDir.FullName
            });

        project.resolveSourceFileDependencies();
        await project.emit();
        await sourceFile.emit();

        let fileName = sourceFile.getEmitOutput().getOutputFiles().find(
            (file) =>
            {
                return parse(file.getFilePath()).name === parse(this.FileMapping.Destination).name;
            }).getFilePath();

        if (fileName in require.cache)
        {
            delete require.cache[fileName];
        }

        return require(fileName);
    }
}
