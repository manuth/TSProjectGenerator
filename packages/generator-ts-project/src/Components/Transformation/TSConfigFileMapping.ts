import { GeneratorOptions, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { fileName, TSConfigJSON } from "types-tsconfig";
import { changeExt, extname } from "upath";
import { JSONCTransformMapping } from "./JSONCTransformMapping";

/**
 * Provides the functionality to transform `tsconfig.json`-files.
 */
export class TSConfigFileMapping<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends JSONCTransformMapping<TSettings, TOptions, TSConfigJSON>
{
    /**
     * Initializes a new instance of the {@link TSConfigFileMapping `TSConfigFileMapping<TSettings, TOptions, TData>`} class.
     *
     * @param generator
     * The generator of the file-mapping.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>)
    {
        super(generator);
    }

    /**
     * Gets the default base-name of `tsconfig.json`-files.
     */
    public static get BaseName(): string
    {
        return fileName;
    }

    /**
     * Gets the default base-name of the file.
     */
    public get DefaultBaseName(): string
    {
        return TSConfigFileMapping.BaseName;
    }

    /**
     * Gets the base-name of the file.
     */
    public get BaseName(): string
    {
        return TSConfigFileMapping.GetFileName(this.MiddleExtension, this.DefaultBaseName);
    }

    /**
     * Gets the middle file-extension of the output-file.
     */
    public get MiddleExtension(): string
    {
        return "";
    }

    /**
     * @inheritdoc
     */
    public get Source(): string
    {
        return this.BaseName;
    }

    /**
     * @inheritdoc
     */
    public get Destination(): string
    {
        return this.BaseName;
    }

    /**
     * Gets a filename for a `tsconfig.json`-file.
     *
     * @param middleExtension
     * The middle extension to add.
     *
     * @param baseName
     * The name the new file-name should be based on.
     *
     * @returns
     * The file-name for the `tsconfig.json`-file.
     */
    public static GetFileName(middleExtension?: string, baseName?: string): string
    {
        baseName = baseName ?? this.BaseName;

        if ((middleExtension ?? "").length > 0)
        {
            return changeExt(baseName, `${middleExtension}${extname(baseName)}`);
        }
        else
        {
            return baseName;
        }
    }

    /**
     * Processes the specified {@link tsConfig `tsConfig`}.
     *
     * @param tsConfig
     * The typescript-configuration to process.
     *
     * @returns
     * The processed data.
     */
    public override async Transform(tsConfig: TSConfigJSON): Promise<TSConfigJSON>
    {
        return super.Transform(tsConfig);
    }
}
