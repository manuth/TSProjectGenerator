import { GeneratorOptions, IGenerator } from "@manuth/extended-yo-generator";
import { ExportAssignmentStructure, ImportDeclarationStructure, OptionalKind, SourceFile } from "ts-morph";
import path from "upath";
import { TypeScriptCreatorMapping } from "../../../Components/TypeScriptCreatorMapping.js";
import { ITSProjectSettings } from "../../Settings/ITSProjectSettings.js";
import { TSProjectSettingKey } from "../../Settings/TSProjectSettingKey.js";

const { addExt, changeExt, dirname, format, join, parse, relative, sep } = path;

/**
 * Provides the functionality to create typescript-files.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export abstract class TSProjectTypeScriptFileMapping<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends TypeScriptCreatorMapping<TSettings, TOptions>
{
    /**
     * Gets the name of index files.
     */
    public static readonly IndexFileName = "index";

    /**
     * Gets the javascript file extension.
     */
    public static readonly JavaScriptFileExtension = "js";

    /**
     * Initializes a new instance of the {@link TSProjectTypeScriptFileMapping `TSProjectTypeScriptFileMapping<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of this file-mapping.
     *
     * @param sourceFile
     * The sourceFile to write to the file.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>, sourceFile?: SourceFile)
    {
        super(generator, sourceFile);
    }

    /**
     * Gets a value indicating whether the file is intended to be used in an ESModule.
     */
    protected get ESModule(): boolean
    {
        return this.Generator.Settings[TSProjectSettingKey.ESModule];
    }

    /**
     * Gets an import-declaration for importing the specified {@link fileName `fileName`}.
     *
     * @param fileName
     * The name of the file to get an import to.
     *
     * @param leadingTrivia
     * The leading white spaces or comments of the import.
     *
     * @returns
     * The import-declaration for importing the specified {@link fileName `fileName`}.
     */
    protected async GetImportDeclaration(fileName: string, leadingTrivia?: string): Promise<OptionalKind<ImportDeclarationStructure>>
    {
        /**
         * Provides the functionality to process a module-specifier.
         */
        type SpecifierProcessor =
            /**
             * Processes the specified {@link moduleSpecifier `moduleSpecifier`}.
             *
             * @param moduleSpecifier
             * The module-specifier to process.
             *
             * @returns
             * The processed module specifier.
             */
            (moduleSpecifier: string) => string;

        let sourceFile = await this.GetSourceObject();
        let sourceDirName = dirname(this.Destination);
        let postProcessor: SpecifierProcessor = (moduleSpecifier) => moduleSpecifier;
        let mainProcessor = postProcessor;
        let moduleSpecifier: string;

        if (sourceDirName === fileName)
        {
            moduleSpecifier = ".";
        }
        else
        {
            moduleSpecifier = sourceFile.getRelativePathAsModuleSpecifierTo(
                relative(
                    sourceDirName,
                    fileName));
        }

        let resolvedFileName = join(sourceDirName, moduleSpecifier);
        let relativeName = relative(sourceDirName, resolvedFileName);

        if (relativeName === "..")
        {
            moduleSpecifier = relativeName;
        }

        if (parse(fileName).name === TSProjectTypeScriptFileMapping.IndexFileName)
        {
            if (resolvedFileName === changeExt(fileName, ""))
            {
                let parsedPath = parse(moduleSpecifier);
                parsedPath.base = parsedPath.dir;
                parsedPath.name = "";
                parsedPath.dir = "";
                moduleSpecifier = format(parsedPath);
            }

            if (this.ESModule)
            {
                mainProcessor = (moduleSpecifier) =>
                {
                    return [moduleSpecifier, TSProjectTypeScriptFileMapping.IndexFileName].join(sep);
                };
            }
        }

        if (this.ESModule)
        {
            postProcessor = (moduleSpecifier) =>
            {
                return addExt(mainProcessor(moduleSpecifier), TSProjectTypeScriptFileMapping.JavaScriptFileExtension);
            };
        }

        let result: OptionalKind<ImportDeclarationStructure> = {
            moduleSpecifier: postProcessor(moduleSpecifier)
        };

        if (leadingTrivia)
        {
            result.leadingTrivia = leadingTrivia;
        }

        return result;
    }

    /**
     * Gets a declaration for exporting the specified {@link expression `expression`}.
     *
     * @param expression
     * The expression to export.
     *
     * @returns
     * The declaration for exporting the specified {@link expression `expression`}.
     */
    protected GetMainExportDeclaration(expression: string): OptionalKind<ExportAssignmentStructure>
    {
        return {
            expression,
            ...this.ESModule ?
                {
                    isExportEquals: false,
                    leadingTrivia: [
                        "// eslint-disable-next-line import/no-default-export"
                    ]
                } :
                {}
        };
    }
}
