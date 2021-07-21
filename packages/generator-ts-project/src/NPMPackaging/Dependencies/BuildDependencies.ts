import { MyPackageDependencyCollection } from "./MyPackageDependencyCollection";

/**
 * Provides all dependencies which are required for building.
 */
export class BuildDependencies extends MyPackageDependencyCollection
{
    /**
     * Initializes a new instance of the {@link BuildDependencies `BuildDependencies`} class.
     */
    public constructor()
    {
        super(
            {
                devDependencies: [
                    "@manuth/tsconfig",
                    "typescript"
                ]
            });
    }
}
