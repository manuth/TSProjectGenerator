import { EOL } from "os";
import { dirname, relative } from "path";
import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { OptionalKind, printNode, PropertySignatureStructure, SourceFile, SyntaxKind, ts } from "ts-morph";
import { GeneratorTypeScriptMapping } from "./GeneratorTypeScriptMapping";
import { NamingContext } from "./NamingContext";

/**
 * Provides the functionality to create a file which provides generator-settings.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class SettingsInterfaceFileMapping<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends GeneratorTypeScriptMapping<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link SettingsInterfaceFileMapping `SettingsInterfaceFileMapping<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of this file-mapping.
     *
     * @param namingContext
     * A component which provides constants for the file-mapping.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>, namingContext: NamingContext)
    {
        super(generator, namingContext);
    }

    /**
     * @inheritdoc
     */
    public get Destination(): string
    {
        return this.NamingContext.SettingsInterfaceFileName;
    }

    /**
     * @inheritdoc
     *
     * @param sourceFile
     * The source-file to process.
     *
     * @returns
     * The processed data.
     */
    protected override async Transform(sourceFile: SourceFile): Promise<SourceFile>
    {
        /**
         * Creates a property for the option with the specified {@link keyName `keyName`}.
         *
         * @param keyName
         * The name of the key to create a property for.
         *
         * @param description
         * The description of the property.
         *
         * @param type
         * The type of the property.
         *
         * @param first
         * A value indicating whether the property being created is the first one.
         *
         * @returns
         * The newly created property.
         */
        let createProperty = (keyName: string, description: string, type: string, first = false): OptionalKind<PropertySignatureStructure> =>
        {
            return {
                docs: [
                    {
                        description: `${EOL}${description}`
                    }
                ],
                name: printNode(
                    ts.factory.createComputedPropertyName(
                        ts.factory.createPropertyAccessExpression(
                            ts.factory.createIdentifier(this.NamingContext.SettingKeyEnumName),
                            keyName))),
                type,
                leadingTrivia: first ? "" : EOL
            };
        };

        sourceFile.addImportDeclarations(
            [
                {
                    moduleSpecifier: "@manuth/extended-yo-generator",
                    namedImports: [
                        nameof<IGeneratorSettings>()
                    ]
                },
                {
                    moduleSpecifier: sourceFile.getRelativePathAsModuleSpecifierTo(
                        relative(
                            dirname(this.Destination),
                            this.NamingContext.SettingKeyFileName)),
                    namedImports: [
                        this.NamingContext.SettingKeyEnumName
                    ]
                },
                {
                    moduleSpecifier: sourceFile.getRelativePathAsModuleSpecifierTo(
                        relative(
                            dirname(this.Destination),
                            this.NamingContext.GeneratorClassFileName)),
                    namedImports: [
                        this.NamingContext.GeneratorClassName
                    ]
                },
                {
                    moduleSpecifier: sourceFile.getRelativePathAsModuleSpecifierTo(
                        relative(
                            dirname(this.Destination),
                            this.NamingContext.LicenseTypeFileName)),
                    namedImports: [
                        this.NamingContext.LicenseTypeEnumName
                    ]
                }
            ]);

        sourceFile.addInterface(
            {
                docs: [
                    {
                        description: `${EOL}Provides settings for the {@link ${this.NamingContext.GeneratorClassName} \`${this.NamingContext.GeneratorClassName}\`}.`
                    }
                ],
                isExported: true,
                name: this.NamingContext.SettingsInterfaceName,
                extends: [
                    nameof<IGeneratorSettings>()
                ],
                properties: [
                    createProperty(
                        this.NamingContext.DestinationMember,
                        "Gets or sets the destination",
                        printNode(ts.factory.createKeywordTypeNode(SyntaxKind.StringKeyword)),
                        true),
                    createProperty(
                        this.NamingContext.NameMember,
                        "Gets or sets the name.",
                        printNode(ts.factory.createKeywordTypeNode(SyntaxKind.StringKeyword))),
                    createProperty(
                        this.NamingContext.DescriptionMember,
                        "Gets or sets the description.",
                        printNode(ts.factory.createKeywordTypeNode(SyntaxKind.StringKeyword))),
                    createProperty(
                        this.NamingContext.LicenseTypeMember,
                        "Gets or sets the type of the license.",
                        this.NamingContext.LicenseTypeEnumName)
                ]
            });

        sourceFile = await super.Transform(sourceFile);
        return sourceFile;
    }
}