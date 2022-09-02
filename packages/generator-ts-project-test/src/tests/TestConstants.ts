import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { Package } from "@manuth/package-json-editor";

/**
 * Provides constants for testing.
 */
export class TestConstants
{
    /**
     * The package of this module.
     */
    private static package: Package;

    /**
     * Gets the package of this module.
     */
    public static get Package(): Package
    {
        if (!this.package)
        {
            this.package = new Package(join(fileURLToPath(new URL(".", import.meta.url)), "..", "..", Package.FileName));
        }

        return this.package;
    }
}
