import { IPackageJSON, Package } from "@manuth/package-json-editor";
import { JSONCConverter } from "./JSONCConverter";
import { TextConverter } from "./TextConverter";

/**
 * Provides the functionality to parse and dump `package.json`-files.
 */
export class PackageJSONConverter extends TextConverter<Package>
{
    /**
     * The path the resulting code is supposed to be saved to.
     */
    private destinationPath: string;

    /**
     * A component for parsing and dumping the package-metadata.
     */
    private innerConverter: TextConverter<IPackageJSON>;

    /**
     * Initializes a new instance of the {@link PackageJSONConverter `PackageJSONConverter`} class.
     *
     * @param destinationPath
     * The path the resulting code is supposed to be saved to.
     */
    public constructor(destinationPath?: string)
    {
        super();
        this.destinationPath = destinationPath;
        this.innerConverter = new JSONCConverter();
    }

    /**
     * Gets or sets the path the resulting code is supposed to be saved to.
     */
    public get DestinationPath(): string
    {
        return this.destinationPath;
    }

    /**
     * @inheritdoc
     */
    public set DestinationPath(value: string)
    {
        this.destinationPath = value;
    }

    /**
     * Gets a component for parsing and dumping the package-metadata.
     */
    protected get InnerConverter(): TextConverter<IPackageJSON>
    {
        return this.innerConverter;
    }

    /**
     * @inheritdoc
     *
     * @param text
     * The text to parse.
     *
     * @returns
     * The parsed representation of the specified {@link text `text`}.
     */
    public override Parse(text: string): Package
    {
        let metadata = this.InnerConverter.Parse(text);

        if (this.DestinationPath)
        {
            return new Package(this.DestinationPath, metadata);
        }
        else
        {
            return new Package(metadata);
        }
    }

    /**
     * @inheritdoc
     *
     * @param npmPackage
     * The package to dump.
     *
     * @returns
     * A {@link String `string`} representing the specified {@link npmPackage `data`}.
     */
    public Dump(npmPackage: Package): string
    {
        return this.InnerConverter.Dump(npmPackage.ToJSON());
    }
}
