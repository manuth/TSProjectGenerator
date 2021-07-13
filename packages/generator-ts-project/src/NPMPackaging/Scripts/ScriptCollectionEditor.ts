import { IGenerator, PropertyResolverCollectionEditor } from "@manuth/extended-yo-generator";
import { IScriptMapping } from "./IScriptMapping";
import { ScriptMapping } from "./ScriptMapping";

/**
 * Represents a set of script-mappings.
 */
export class ScriptCollectionEditor extends PropertyResolverCollectionEditor<IScriptMapping<any, any>, ScriptMapping<any, any>>
{
    /**
     * Initializes a new instance of the {@link ScriptCollectionEditor `ScriptCollectionEditor`} class.
     *
     * @param generator
     * The generator of the collection.
     *
     * @param items
     * The items to edit.
     */
    public constructor(generator: IGenerator<any, any>, items: Array<ScriptMapping<any, any>>);

    /**
     * Initializes a new instance of the {@link ScriptCollectionEditor `ScriptCollectionEditor`} class.
     *
     * @param generator
     * The generator of the collection.
     *
     * @param itemProvider
     * A function for providing the items.
     */
    public constructor(generator: IGenerator<any, any>, itemProvider: () => Array<ScriptMapping<any, any>>);

    /**
     * Initializes a new instance of the {@link ScriptCollectionEditor `ScriptCollectionEditor`} class.
     *
     * @param args
     * The arguments for initializing the new collection.
     */
    public constructor(...args: any[])
    {
        super(...(args as [any, any]));
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
        return new ScriptMapping(this.Generator, options);
    }
}
