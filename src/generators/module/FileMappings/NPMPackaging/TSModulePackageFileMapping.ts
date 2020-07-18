import { IGenerator } from "@manuth/extended-yo-generator";
import { Package } from "@manuth/package-json-editor";
import { TSProjectPackageFileMapping } from "../../../../Project/FileMappings/NPMPackagning/TSProjectPackageFileMapping";
import { ITSProjectSettings } from "../../../../Project/Settings/ITSProjectSettings";

/**
 * Represents a file-mapping for the `package.json` file of `TSModule`s.
 */
export class TSModulePackageFileMapping<T extends ITSProjectSettings> extends TSProjectPackageFileMapping<T>
{
    /**
     * Initializes a new instance of the `TSModulePackageFileMapping<T>` class.
     *
     * @param generator
     * The generator of the file-mapping.
     */
    public constructor(generator: IGenerator<T>)
    {
        super(generator);
    }

    /**
     * @inheritdoc
     *
     * @returns
     * The loaded package.
     */
    protected async LoadPackage(): Promise<Package>
    {
        let result = await super.LoadPackage();
        result.Main = "lib/index.js";
        result.Types = "lib/index.d.ts";
        return result;
    }
}
