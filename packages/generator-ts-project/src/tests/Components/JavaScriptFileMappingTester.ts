import { IGenerator, IGeneratorSettings, IFileMapping } from "@manuth/extended-yo-generator";
import { FileMappingTester } from "./FileMappingTester";

/**
 * Provides the functionality to test javascript file-mappings.
 */
export class JavaScriptFileMappingTester<TGenerator extends IGenerator<TSettings>, TSettings extends IGeneratorSettings, TFileMapping extends IFileMapping<TSettings>> extends FileMappingTester<TGenerator, TSettings, TFileMapping>
{
    /**
     * Initializes a new instance of the `JavaScriptFileMappingTester` class.
     *
     * @param generator
     * The generator of the file-mapping.
     *
     * @param fileMapping
     * The file-mapping to test.
     */
    public constructor(generator: TGenerator, fileMapping: TFileMapping)
    {
        super(generator, fileMapping);
    }

    /**
     * Requires the javascript-file.
     *
     * @returns
     * The exported members of the file.
     */
    public async Require(): Promise<any>
    {
        let fileName = require.resolve(await this.FileMapping.Destination);

        if (fileName in require.cache)
        {
            delete require.cache[fileName];
        }

        return require(fileName);
    }
}
