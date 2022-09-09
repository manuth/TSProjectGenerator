import { EOL } from "node:os";
import { GeneratorOptions, IGenerator } from "@manuth/extended-yo-generator";
import { EnumMemberStructure, OptionalKind, SourceFile } from "ts-morph";
import { ITSProjectSettings } from "../../../../Project/Settings/ITSProjectSettings.js";
import { GeneratorTypeScriptMapping } from "./GeneratorTypeScriptMapping.js";
import { NamingContext } from "./NamingContext.js";

/**
 * Provides the functionality to create a file which provides setting-keys.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class SettingKeyFileMapping<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends GeneratorTypeScriptMapping<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link SettingKeyFileMapping `SettingKeyFileMapping<TSettings, TOptions>`} class.
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
        return this.NamingContext.SettingKeyFileName;
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
         * Creates an enum-member.
         *
         * @param memberName
         * The name of the enum-member to create.
         *
         * @param value
         * The value of the enum-member to create.
         *
         * @param first
         * A value indicating whether the member is the first one in the enum.
         *
         * @returns
         * The newly created enum-member.
         */
        function createEnumMember(memberName: string, value: string, first = false): OptionalKind<EnumMemberStructure>
        {
            return {
                docs: [
                    {
                        description: `${EOL}Indicates the {@link ${memberName} \`${memberName}\`}-setting.`
                    }
                ],
                name: memberName,
                value,
                leadingTrivia: first ? "" : EOL
            };
        }

        sourceFile = await super.Transform(sourceFile);

        sourceFile.addEnum(
            {
                isExported: true,
                docs: [
                    {
                        description: `${EOL}Specifies a setting.`
                    }
                ],
                name: this.NamingContext.SettingKeyEnumName,
                members: [
                    createEnumMember(this.NamingContext.DestinationMember, "destination", true),
                    createEnumMember(this.NamingContext.NameMember, "name"),
                    createEnumMember(this.NamingContext.DescriptionMember, "description"),
                    createEnumMember(this.NamingContext.LicenseTypeMember, "licenseType")
                ]
            });

        return sourceFile;
    }
}
