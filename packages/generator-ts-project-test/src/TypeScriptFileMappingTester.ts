import { createRequire } from "node:module";
import { parse } from "node:path";
import { GeneratorOptions, IFileMapping, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { TextConverter, TypeScriptConverter } from "@manuth/generator-ts-project";
import { TempDirectory } from "@manuth/temp-files";
import { ModuleKind, ScriptTarget, SourceFile } from "ts-morph";
import { ConvertibleFileMappingTester } from "./ConvertibleFileMappingTester.js";
import { ICompilationResult } from "./TypeScript/ICompilationResult.js";

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
     * A {@link require `require`} instance.
     */
    private nodeRequire: NodeRequire = null;

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
     * Gets a {@link require `require`} instance.
     */
    protected get NodeRequire(): NodeRequire
    {
        if (this.nodeRequire === null)
        {
            this.nodeRequire = createRequire(import.meta.url);
        }

        return this.nodeRequire;
    }

    /**
     * Requires the output-file.
     *
     * @returns
     * The result of the {@link require `require`}-call.
     */
    public async Require(): Promise<any>
    {
        let compilationResult = await this.Compile();

        let result = this.NodeRequire(compilationResult.FileName);
        compilationResult.TempDirectory.Dispose();

        for (let fileName of Object.keys(this.NodeRequire.cache))
        {
            delete this.NodeRequire.cache[fileName];
        }

        return result;
    }

    /**
     * Compiles the underlying file.
     *
     * @returns
     * An object containing information about the compilation.
     */
    protected async Compile(): Promise<ICompilationResult>
    {
        let tempDir = new TempDirectory();
        let sourceFile = await this.ParseOutput();
        let project = sourceFile.getProject();

        project.compilerOptions.set(
            {
                outDir: tempDir.FullName,
                target: ScriptTarget.ES2015,
                module: ModuleKind.Node16
            });

        project.resolveSourceFileDependencies();
        await project.emit();
        await sourceFile.emit();

        let fileName = sourceFile.getEmitOutput().getOutputFiles().find(
            (file) =>
            {
                return parse(file.getFilePath()).name === parse(this.FileMapping.Destination).name;
            }).getFilePath();

        for (let sourceFile of project.getSourceFiles())
        {
            sourceFile.forget();
        }

        return {
            TempDirectory: tempDir,
            FileName: fileName
        };
    }
}
