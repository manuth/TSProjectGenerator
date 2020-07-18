import { BuildDependencies } from "./BuildDependencies";
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
                    "@manuth/extended-yo-generator"
                ],
                devDependencies: [
                    "@types/mocha",
                    "@types/node",
                    "mocha",
                    "rimraf",
                    "yo"
                ]
            });

        this.Register(new BuildDependencies());
    }
}
