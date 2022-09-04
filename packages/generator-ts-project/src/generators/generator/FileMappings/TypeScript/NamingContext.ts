import { join } from "node:path";
import camelCase from "lodash.camelcase";

/**
 * Provides constants for naming generated files and components.
 */
export class NamingContext
{
    /**
     * The id of the generator to create.
     */
    private generatorID: string;

    /**
     * The name of the generator-class to create.
     */
    private generatorName: string = null;

    /**
     * The human-readable name of the generator to create.
     */
    private displayName: string;

    /**
     * The name of the directory to save the source-files to.
     */
    private sourceRoot: string;

    /**
     * A value indicating whether the names are intended for the use in an ESModule.
     */
    private esModule: boolean;

    /**
     * Initializes a new instance lf the {@link NamingContext `NamingContext`} class.
     *
     * @param id
     * The id of the generator to create.
     *
     * @param displayName
     * The human-readable name of the generator to create.
     *
     * @param sourceRoot
     * The name of the directory to save the source-files to.
     *
     * @param esModule
     * A value indicating whether the names are intended for the use in an ESModule.
     */
    public constructor(id: string, displayName: string, sourceRoot: string, esModule = false)
    {
        this.generatorID = id;
        this.displayName = displayName;
        this.sourceRoot = sourceRoot;
        this.esModule = esModule;
    }

    /**
     * Gets the id of the generator to create.
     */
    public get GeneratorID(): string
    {
        return this.generatorID;
    }

    /**
     * Gets a value indicating whether the names are intended for the use in an ESModule.
     */
    protected get ESModule(): boolean
    {
        return this.esModule;
    }

    /**
     * Gets the name of the index-file of the generator to create.
     */
    public get GeneratorIndexFileName(): string
    {
        return join(this.GeneratorDirName, this.AddTypeScriptExtension("index"));
    }

    /**
     * Gets the name of the file to write the generator-class to.
     */
    public get GeneratorClassFileName(): string
    {
        return join(this.GeneratorDirName, this.GeneratorClassBaseName);
    }

    /**
     * Gets the name of the generator-class to create.
     */
    public get GeneratorClassName(): string
    {
        return `${this.GeneratorName}Generator`;
    }

    /**
     * Gets the human-readable name of the generator to create.
     */
    public get GeneratorDisplayName(): string
    {
        return this.displayName;
    }

    /**
     * Gets the name of the `chalk`-component.
     */
    public get ChalkName(): string
    {
        return "chalk";
    }

    /**
     * Gets the name of the `dedent`-component.
     */
    public get DedentName(): string
    {
        return "dedent";
    }

    /**
     * Gets the name of the `yosay`-component.
     */
    public get YoSayName(): string
    {
        return "yosay";
    }

    /**
     * Gets the name of the file to write the `LicenseType`-enum to.
     */
    public get LicenseTypeFileName(): string
    {
        return join(this.GeneratorDirName, this.LicenseTypeBaseName);
    }

    /**
     * Gets the name of the `LicenseType`-enum to create.
     */
    public get LicenseTypeEnumName(): string
    {
        return "LicenseType";
    }

    /**
     * Gets the name of the enum-member which indicates an Apache-license.
     */
    public get ApacheMember(): string
    {
        return "Apache";
    }

    /**
     * Gets the name of the enum-member which indicates the GPL-license.
     */
    public get GPLMember(): string
    {
        return "GPL";
    }

    /**
     * Gets the name of the file to write the setting-key enum to.
     */
    public get SettingKeyFileName(): string
    {
        return join(this.GeneratorDirName, this.SettingKeyBaseName);
    }

    /**
     * Gets the name of the enum which represents a generator-setting.
     */
    public get SettingKeyEnumName(): string
    {
        return `${this.GeneratorName}SettingKey`;
    }

    /**
     * Gets the name of the enum-member which indicates the destination-setting.
     */
    public get DestinationMember(): string
    {
        return "Destination";
    }

    /**
     * Gets the name of the enum-member which indicates the name-setting.
     */
    public get NameMember(): string
    {
        return "Name";
    }

    /**
     * Gets the name of the enum-member which indicates the description-setting.
     */
    public get DescriptionMember(): string
    {
        return "Description";
    }

    /**
     * Gets the name of the enum-member which indicates the license-type setting.
     */
    public get LicenseTypeMember(): string
    {
        return "LicenseType";
    }

    /**
     * Gets the name of the file to write the settings-interface to.
     */
    public get SettingsInterfaceFileName(): string
    {
        return join(this.GeneratorDirName, this.SettingsInterfaceBaseName);
    }

    /**
     * Gets the name of the settings-interface of the generator.
     */
    public get SettingsInterfaceName(): string
    {
        return `I${this.GeneratorName}Settings`;
    }

    /**
     * Gets the name of the file which contains the main suite.
     */
    public get MainSuiteFileName(): string
    {
        return join(this.TestDirName, this.AddTestFileExtension("main"));
    }

    /**
     * Gets the name of the suite-function of the generators.
     */
    public get GeneratorSuiteFunctionName(): string
    {
        return "GeneratorTests";
    }

    /**
     * Gets the name of the file which contains the generator-suite.
     */
    public get GeneratorSuiteFileName(): string
    {
        let processor: typeof this.AddTypeScriptExtension = (fileName: string): string =>
        {
            // return this.ESModule ? this.AddTestFileExtension(fileName) : this.AddTypeScriptExtension(fileName);
            return this.AddTypeScriptExtension(fileName);
        };

        return join(this.GeneratorTestDirName, processor("index"));
    }

    /**
     * Gets the name of the test-function of the generator.
     */
    public get GeneratorTestFunctionName(): string
    {
        return `${this.GeneratorClassName}Tests`;
    }

    /**
     * Gets the name of the file to save the unit-tests for the generator to.
     */
    public get GeneratorTestFileName(): string
    {
        return join(this.GeneratorTestDirName, this.GeneratorTestBaseName);
    }

    /**
     * Gets the name of the directory to save the source-files to.
     */
    protected get SourceRoot(): string
    {
        return this.sourceRoot;
    }

    /**
     * Gets the name of the generator to create.
     */
    protected get GeneratorName(): string
    {
        if (this.generatorName === null)
        {
            this.generatorName = (this.GeneratorID.charAt(0).toUpperCase() + camelCase(this.GeneratorID).slice(1));
        }

        return this.generatorName;
    }

    /**
     * Gets the name of the directory to save the generator-components to.
     */
    protected get GeneratorDirName(): string
    {
        return join(this.SourceRoot, "generators", this.GeneratorID);
    }

    /**
     * Gets the base-name of the file to write the generator-class to.
     */
    protected get GeneratorClassBaseName(): string
    {
        return this.AddTypeScriptExtension(this.GeneratorClassName);
    }

    /**
     * Gets the base-name of the file to write the `LicenseType`-enum to.
     */
    protected get LicenseTypeBaseName(): string
    {
        return this.AddTypeScriptExtension(this.LicenseTypeEnumName);
    }

    /**
     * Gets the base-name of the file to write the setting-key enum to.
     */
    protected get SettingKeyBaseName(): string
    {
        return this.AddTypeScriptExtension(this.SettingKeyEnumName);
    }

    /**
     * Gets the base-name of the file to write the settings-interface to.
     */
    protected get SettingsInterfaceBaseName(): string
    {
        return this.AddTypeScriptExtension(this.SettingsInterfaceName);
    }

    /**
     * Gets the name of the directory to save unit-tests to.
     */
    protected get TestDirName(): string
    {
        return join(this.SourceRoot, "tests");
    }

    /**
     * Gets the name of the directory to save unit-tests for generators to.
     */
    protected get GeneratorTestDirName(): string
    {
        return join(this.TestDirName, "Generators");
    }

    /**
     * Gets the base-name of the generator unit-test file.
     */
    protected get GeneratorTestBaseName(): string
    {
        return this.AddTestFileExtension(this.GeneratorClassName);
    }

    /**
     * Adds a unit-test file-extension to the specified {@link fileName `fileName`}.
     *
     * @param fileName
     * The name of the file to add the unit-test file-extension to.
     *
     * @returns
     * The specified {@link fileName `fileName`} with a unit-test file-extension.
     */
    protected AddTestFileExtension(fileName: string): string
    {
        return this.AddTypeScriptExtension(`${fileName}.test`);
    }

    /**
     * Adds the typescript file-extension to the specified {@link fileName `fileName`}.
     *
     * @param fileName
     * The name of the file to add the typescript-extension to.
     *
     * @returns
     * The specified {@link fileName `fileName`} with the typescript-extension.
     */
    protected AddTypeScriptExtension(fileName: string): string
    {
        return `${fileName}.ts`;
    }
}
