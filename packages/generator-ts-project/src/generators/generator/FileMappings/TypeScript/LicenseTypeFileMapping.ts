import { EOL } from "os";
import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { SourceFile } from "ts-morph";
import { GeneratorTypeScriptMapping } from "./GeneratorTypeScriptMapping";
import { NamingContext } from "./NamingContext";

/**
 * Provides the functionality to create a file which provides license-types.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class LicenseTypeFileMapping<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends GeneratorTypeScriptMapping<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link LicenseTypeFileMapping `LicenseTypeFileMapping<TSettings, TOptions>`} class.
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
        return this.NamingContext.LicenseTypeFileName;
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
        sourceFile = await super.Transform(sourceFile);

        sourceFile.addEnum(
            {
                isExported: true,
                docs: [
                    {
                        description: `${EOL}Represents a license-type.`
                    }
                ],
                name: this.NamingContext.LicenseTypeEnumName,
                members: [
                    {
                        docs: [
                            {
                                description: `${EOL}Indicates the Apache-license.`
                            }
                        ],
                        name: this.NamingContext.ApacheMember
                    },
                    {
                        docs: [
                            {
                                description: `${EOL}Indicates the GPL-license.`
                            }
                        ],
                        name: this.NamingContext.GPLMember,
                        leadingTrivia: `${EOL}`
                    }
                ]
            });

        return sourceFile;
    }
}
