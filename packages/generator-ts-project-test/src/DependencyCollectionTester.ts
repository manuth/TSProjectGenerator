import { GeneratorOptions, IFileMapping, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { DependencyCollection, Package, PackageDependencyCollectionOptions } from "@manuth/package-json-editor";
import { TempFileSystem } from "@manuth/temp-files";
import { PackageFileMappingTester } from "./PackageFileMappingTester";

/**
 * Provides the functionality to test a package containing dependencies.
 */
class DependencyPackageTester extends PackageFileMappingTester<IGenerator<IGeneratorSettings, GeneratorOptions>, IGeneratorSettings, GeneratorOptions, IFileMapping<IGeneratorSettings, GeneratorOptions>>
{
    /**
     * The {@link DependencyCollection `DependencyCollection`} to test.
     */
    private dependencyCollection: DependencyCollection;

    /**
     * Initializes a new instance of the {@link DependencyPackageTester `DependencyPackageTester`} class.
     *
     * @param dependencyCollection
     * The {@link DependencyCollection `DependencyCollection`} to test.
     */
    public constructor(dependencyCollection: DependencyCollection)
    {
        super(null, { Destination: TempFileSystem.TempName() });
        this.dependencyCollection = dependencyCollection;
    }

    /**
     * Gets or sets the package to test.
     */
    public get Package(): Package
    {
        let result = new Package();
        result.Register(this.DependencyCollection);
        return result;
    }

    /**
     * Gets the dependency-collection to test.
     */
    public get DependencyCollection(): DependencyCollection
    {
        return this.dependencyCollection;
    }

    /**
     * @inheritdoc
     *
     * @returns
     * The contents of the output-file.
     */
    public override async ReadOutput(): Promise<string>
    {
        return this.Converter.Dump(this.Package);
    }
}

/**
 * Provides the functionality to test a {@link DependencyCollection `DependencyCollection`}.
 */
export class DependencyCollectionTester
{
    /**
     * A component for testing the dependencies.
     */
    private dependencyPackageTester: PackageFileMappingTester<IGenerator<IGeneratorSettings, GeneratorOptions>, IGeneratorSettings, GeneratorOptions, IFileMapping<IGeneratorSettings, GeneratorOptions>>;

    /**
     * Initializes a new instance of the {@link DependencyCollectionTester `DependencyCollectionTester`} class.
     *
     * @param collection
     * The collection to test.
     */
    public constructor(collection: DependencyCollection)
    {
        this.dependencyPackageTester = new DependencyPackageTester(collection);
    }

    /**
     * Gets a component for testing the dependencies.
     */
    public get DependencyPackageTester(): PackageFileMappingTester<IGenerator<IGeneratorSettings, GeneratorOptions>, IGeneratorSettings, GeneratorOptions, IFileMapping<IGeneratorSettings, GeneratorOptions>>
    {
        return this.dependencyPackageTester;
    }

    /**
     * Asserts that the dependencies are present in the output-package.
     *
     * @param dependencies
     * The expected dependencies.
     */
    public async AssertDependencies(dependencies: DependencyCollection): Promise<void>;

    /**
     * Asserts the existence of the specified {@link dependencies `dependencies`}.
     *
     * @param dependencies
     * The dependencies to check.
     *
     * @param present
     * A value indicating whether the specified {@link dependencies `dependencies`} are expected to be present.
     */
    public async AssertDependencies(dependencies: DependencyCollection, present: boolean): Promise<void>;

    /**
     * Asserts the existence of the specified {@link dependencies `dependencies`}.
     *
     * @param dependencies
     * The dependencies to check.
     *
     * @param present
     * A value indicating whether the specified {@link dependencies `dependencies`} are expected to be present.
     *
     * @param exactVersion
     * A value indicating whether the versions of the specified {@link dependencies `dependencies`} are expected to be exactly equal.
     */
    public async AssertDependencies(dependencies: DependencyCollection, present: true, exactVersion: boolean): Promise<void>;

    /**
     * Asserts the existence of the specified {@link dependencies `dependencies`}.
     *
     * @param dependencies
     * The dependencies to check.
     *
     * @param present
     * A value indicating whether the specified {@link dependencies `dependencies`} are expected to be present.
     *
     * @param exactVersion
     * A value indicating whether the versions of the specified {@link dependencies `dependencies`} are expected to be exactly equal.
     */
    public async AssertDependencies(dependencies: DependencyCollection, present = true, exactVersion = true): Promise<void>
    {
        return this.DependencyPackageTester.AssertDependencies(dependencies, present as any, exactVersion);
    }

    /**
     * Asserts the existence of the dependencies with the specified {@link dependencyNames `dependencyNames`}.
     *
     * @param dependencyNames
     * The names of the dependencies to check.
     *
     * @param present
     * A value indicating whether the names with the specified {@link dependencyNames `dependencyNames`} are expected to be present.
     */
    public async AssertDependencyNames(dependencyNames: PackageDependencyCollectionOptions, present = true): Promise<void>
    {
        return this.DependencyPackageTester.AssertDependencyNames(dependencyNames, present);
    }
}
