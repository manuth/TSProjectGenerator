import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { Dictionary, Package } from "@manuth/package-json-editor";

/**
 * Provides constants for this package.
 */
export class Constants
{
    /**
     * The metadata of this package.
     */
    private static package: Package = null;

    /**
     * The dependencies of this package.
     */
    private static dependencies: Dictionary<string, string> = null;

    /**
     * Gets the metadata of this package.
     */
    public static get Package(): Package
    {
        if (this.package === null)
        {
            this.package = new Package(join(fileURLToPath(new URL(".", import.meta.url)), "..", "..", Package.FileName));
        }

        return this.package;
    }

    /**
     * Gets the dependencies of this package.
     */
    public static get Dependencies(): Dictionary<string, string>
    {
        if (this.dependencies === null)
        {
            this.dependencies = this.Package.AllDependencies;
        }

        return this.dependencies;
    }
}
