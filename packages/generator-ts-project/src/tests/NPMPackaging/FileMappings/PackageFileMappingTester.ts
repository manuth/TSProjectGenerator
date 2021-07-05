import { ok, strictEqual } from "assert";
import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { FileMappingTester } from "@manuth/extended-yo-generator-test";
import { DependencyCollection, IPackageJSON, Package } from "@manuth/package-json-editor";
import { PackageFileMapping } from "../../../NPMPackaging/FileMappings/PackageFileMapping";

/**
 * Provides the functionality to test a package-filemapping.
 *
 * @template TGenerator
 * The type of the generator.
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
export class PackageFileMappingTester<TGenerator extends IGenerator<TSettings, TOptions>, TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions, TFileMapping extends PackageFileMapping<TSettings, TOptions>> extends FileMappingTester<TGenerator, TSettings, TOptions, TFileMapping>
{
    /**
     * Initializes a new instance of the {@link PackageFileMappingTester `PackageFileMappingTester<TGenerator, TSettings, TOptions, TFileMapping>`} class.
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
     * Gets the resulting package of the file-mapping.
     */
    public get Package(): Promise<Package>
    {
        return (
            async () =>
            {
                return new Package(JSON.parse(await this.Content));
            })();
    }

    /**
     * Writes the specified package to the output of this file-mapping.
     *
     * @param npmPackage
     * The package to write.
     */
    public async WritePackage(npmPackage: IPackageJSON): Promise<void>
    {
        this.Generator.fs.writeJSON(this.FileMapping.Destination, new Package(npmPackage).ToJSON());
        await this.Commit();
    }

    /**
     * Asserts the dependencies of the resulting package.
     *
     * @param dependencies
     * The expected dependencies.
     *
     * @param present
     * A value indicating whether the dependencies are expected to be present.
     */
    public async AssertDependencies(dependencies: DependencyCollection, present = true): Promise<void>
    {
        let npmPackage = await this.Package;

        let dependencyListSets = [
            [dependencies.Dependencies, npmPackage.Dependencies],
            [dependencies.DevelpomentDependencies, npmPackage.DevelpomentDependencies],
            [dependencies.PeerDependencies, npmPackage.PeerDependencies],
            [dependencies.OptionalDependencies, npmPackage.OptionalDependencies]
        ];

        for (let dependencyListSet of dependencyListSets)
        {
            for (let dependency of dependencyListSet[0].Entries)
            {
                strictEqual(dependencyListSet[1].Has(dependency[0]), present);

                if (present)
                {
                    strictEqual(dependencyListSet[1].Get(dependency[0]), dependency[1]);
                }
            }
        }

        ok(
            dependencies.BundledDependencies.Values.every(
                (dependency) =>
                {
                    return npmPackage.BundledDependencies.Contains(dependency) === present;
                }));
    }

    /**
     * Cleans the file-mapping output.
     */
    public override async Clean(): Promise<void>
    {
        await super.Clean();
        return this.FileMappingOptions.Clear();
    }
}
