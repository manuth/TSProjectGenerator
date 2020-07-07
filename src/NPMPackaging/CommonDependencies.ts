import { PackageDependencyCollection } from "./PackageDependencyCollection";

/**
 * Provides all common dependencies.
 */
export class CommonDependencies extends PackageDependencyCollection
{
    /**
     * Initializes a new instance of the `CommonDependencies` class.
     */
    public constructor()
    {
        super(
            {
                dependencies: [
                    "extended-yo-generator"
                ],
                devDependencies: [
                    "@manuth/tsconfig",
                    "@types/mocha",
                    "@types/node",
                    "mocha",
                    "rimraf",
                    "typescript",
                    "yo"
                ]
            });
    }
}
