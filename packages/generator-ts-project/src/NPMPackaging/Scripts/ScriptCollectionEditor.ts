import { IGenerator, PropertyResolverCollectionEditor } from "@manuth/extended-yo-generator";
import { Package } from "@manuth/package-json-editor";
import { IScriptMapping } from "./IScriptMapping.js";
import { ScriptMapping } from "./ScriptMapping.js";

/**
 * Represents a set of script-mappings.
 */
export class ScriptCollectionEditor extends PropertyResolverCollectionEditor<IScriptMapping<any, any>, ScriptMapping<any, any>>
{
    /**
     * The package to load the source-scripts from.
     */
    private sourcePackage: Package;

    /**
     * Initializes a new instance of the {@link ScriptCollectionEditor `ScriptCollectionEditor`} class.
     *
     * @param generator
     * The generator of the collection.
     *
     * @param sourcePackage
     * The package to load the source-scripts from.
     *
     * @param items
     * The items to edit.
     */
    public constructor(generator: IGenerator<any, any>, sourcePackage: Package, items: Array<ScriptMapping<any, any>>);

    /**
     * Initializes a new instance of the {@link ScriptCollectionEditor `ScriptCollectionEditor`} class.
     *
     * @param generator
     * The generator of the collection.
     *
     * @param sourcePackage
     * The package to load the source-scripts from.
     *
     * @param itemProvider
     * A function for providing the items.
     */
    public constructor(generator: IGenerator<any, any>, sourcePackage: Package, itemProvider: () => Array<ScriptMapping<any, any>>);

    /**
     * Initializes a new instance of the {@link ScriptCollectionEditor `ScriptCollectionEditor`} class.
     *
     * @param generator
     * The generator of the collection.
     *
     * @param sourcePackage
     * The package to load the source-scripts from.
     *
     * @param items
     * The items to edit.
     */
    public constructor(generator: IGenerator<any, any>, sourcePackage: Package, items: any)
    {
        super(generator, items);
        this.sourcePackage = sourcePackage;
    }

    /**
     * Gets the package to load the source-scripts from.
     */
    public get SourcePackage(): Package
    {
        return this.sourcePackage;
    }

    /**
     * @inheritdoc
     *
     * @param options
     * The options for the new item.
     *
     * @returns
     * A newly created {@link ScriptMapping `ScriptMapping<TSettings, TOptions>`}.
     */
    protected CreateItem(options: IScriptMapping<any, any>): ScriptMapping<any, any>
    {
        return new ScriptMapping(this.Generator, this.SourcePackage, options);
    }
}
