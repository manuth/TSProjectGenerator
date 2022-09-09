import { PackageDependencyCollection, PackageDependencyCollectionOptions } from "@manuth/package-json-editor";
import { Constants } from "../../Core/Constants.js";

/**
 * Represents a collection of dependencies which are loaded from {@link Constants.Package `Constants.Package`}.
 */
export class MyPackageDependencyCollection extends PackageDependencyCollection
{
    /**
     * Initializes a new instance of the {@link MyPackageDependencyCollection `MyPackageDependencyCollection`} class.
     *
     * @param dependencies
     * The dependencies to load.
     */
    public constructor(dependencies: PackageDependencyCollectionOptions)
    {
        super(Constants.Package, dependencies);
    }
}
