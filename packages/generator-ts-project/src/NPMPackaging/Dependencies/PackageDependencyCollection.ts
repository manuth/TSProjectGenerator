import { DependencyCollection, IDependencyCollectionOptions, PropertyDictionary } from "@manuth/package-json-editor";
import { Constants } from "../../Core/Constants";
import { PackageDependencyCollectionOptions } from "./PackageDependencyCollectionOptions";

/**
 * Provides dependencies loaded from package.
 */
export class PackageDependencyCollection extends DependencyCollection
{
    /**
     * Initializes a new instance of the `PackageDependencyCollection` class.
     *
     * @param collection
     * The collection to load.
     */
    public constructor(collection: PackageDependencyCollectionOptions)
    {
        super();
        let dependencies = new PropertyDictionary(collection);
        let dependencyCollection: IDependencyCollectionOptions = {};

        for (let key of dependencies.Keys)
        {
            dependencyCollection[key] = {};

            for (let dependency of dependencies.Get(key))
            {
                dependencyCollection[key][dependency] = Constants.Dependencies.Get(dependency);
            }
        }

        this.Register(new DependencyCollection(dependencyCollection));
    }
}
