import { DependencyCollection, Dictionary, IDependencyCollectionOptions, KeyOfType, PackageDependencyCollectionOptions } from "@manuth/package-json-editor";
import { MyPackageDependencyCollection } from "./MyPackageDependencyCollection.js";

/**
 * Represents a collection of dependencies which can act differently depending on whether it is registered for an ESModule.
 */
export class ESModuleDependencyCollection extends MyPackageDependencyCollection
{
    /**
     * A value indicating whether the ESModule dependencies are allowed.
     */
    private esModule: boolean;

    /**
     * Initializes a new instance of the {@link ESModuleDependencyCollection `ESModuleDependencyCollection`} class.
     *
     * @param dependencies
     * The dependencies to load.
     *
     * @param esModule
     * A value indicating whether the ESModule dependencies are allowed.
     */
    public constructor(dependencies: PackageDependencyCollectionOptions, esModule: boolean)
    {
        super(dependencies);
        this.esModule = esModule;
    }

    /**
     * Gets a value indicating whether the collection is intended to be used in an ESModule.
     */
    protected get ESModule(): boolean
    {
        return this.esModule;
    }

    /**
     * Gets the overrides which should be applied to the dependencies.
     */
    protected get Overrides(): IDependencyCollectionOptions
    {
        return this.ESModule ? this.ESModuleOverrides : this.CommonJSOverrides;
    }

    /**
     * Gets the overrides which should be applied if the dependencies are registered for an ESModule.
     */
    protected get ESModuleOverrides(): IDependencyCollectionOptions
    {
        return {};
    }

    /**
     * Gets the overrides which should be applied if the dependencies are registered for an CommonJS package.
     */
    protected get CommonJSOverrides(): IDependencyCollectionOptions
    {
        return {};
    }

    /**
     * Applies the specified {@link overrides `overrides`} to the specified {@link dependencies `dependencies`} collection.
     *
     * @param dependencies
     * The dependencies to inject the specified {@link overrides `overrides`} into.
     *
     * @param overrides
     * The overrides to inject.
     */
    protected InjectOverrides(dependencies: Dictionary<string, string>, overrides: Record<string, string>): void
    {
        overrides ??= {};

        for (let dependency of Object.keys(overrides ?? {}))
        {
            if (dependencies.Has(dependency))
            {
                dependencies.Remove(dependency);
            }

            dependencies.Add(dependency, overrides[dependency]);
        }
    }

    /**
     * @inheritdoc
     *
     * @param listName
     * The name of the list of dependency-names to load.
     *
     * @returns
     * The loaded dependencies.
     */
    protected override LoadDependencies(listName: keyof PackageDependencyCollectionOptions): Dictionary<string, string>;

    /**
     * @inheritdoc
     *
     * @param listName
     * The name of the list of dependency-names to load.
     *
     * @param packageListName
     * The name of the list of the package to load the dependency-versions from.
     *
     * @returns
     * The loaded dependencies.
     */
    protected override LoadDependencies(listName: keyof PackageDependencyCollectionOptions, packageListName?: KeyOfType<DependencyCollection, Dictionary<string, string>>): Dictionary<string, string>
    {
        let result = super.LoadDependencies(listName, packageListName);
        this.InjectOverrides(result, this.Overrides[listName]);
        return result;
    }
}
