import { IGeneratorSettings } from "@manuth/extended-yo-generator";
import { JSONProcessor } from "../../Components/JSONProcessor";

/**
 * Provides an implementation of the `JSONProcessor` class` for testing.
 */
export class TestJSONProcessor<T extends IGeneratorSettings> extends JSONProcessor<T, any>
{
    /**
     * The data to return from the `Process` method.
     */
    private data: any;

    /**
     * Initializes a new instance of the `TestJSONProcessor` class.
     *
     * @param data
     * The data to return from the `Process` method.
     */
    public constructor(data: any)
    {
        super(null);
        this.data = data;
    }

    /**
     * @inheritdoc
     *
     * @returns
     * The predefined `data`.
     */
    public async Process(): Promise<any>
    {
        return this.data;
    }
}
