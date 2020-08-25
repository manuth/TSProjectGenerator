import { GeneratorOptions } from "@manuth/extended-yo-generator";
import { YAMLTransformMapping, ITSProjectSettings, TSProjectSettingKey } from "@manuth/generator-ts-project";
import { Document } from "yaml";

/**
 * Provides the functionality to create a `drone.yml` file.
 */
export class DroneFileMapping<TSettings extends ITSProjectSettings, TOptions extends GeneratorOptions> extends YAMLTransformMapping<TSettings, TOptions>
{
    /**
     * @inheritdoc
     */
    public get Source(): Promise<string>
    {
        return (
            async () =>
            {
                return this.Generator.modulePath(".drone.yml");
            })();
    }

    /**
     * @inheritdoc
     */
    public get Destination(): Promise<string>
    {
        return (
            async () =>
            {
                return ".drone.yml";
            })();
    }

    /**
     * @inheritdoc
     *
     * @param documents
     * The documents to transform.
     *
     * @returns
     * The transformed documents.
     */
    public async Transform(documents: Document.Parsed[]): Promise<Document.Parsed[]>
    {
        let document = documents[0];
        let stepsKey = "steps";
        let commandsKey = "commands";
        let steps: any[] = document.get(stepsKey).toJSON();
        document.set("name", this.Generator.Settings[TSProjectSettingKey.DisplayName]);

        for (let i = 0; i < steps.length; i++)
        {
            let commands: string[] = steps[i][commandsKey];

            for (let j = 0; j < commands.length; j++)
            {
                if (commands[j].startsWith("npx lerna publish"))
                {
                    let command = commands[j];
                    document.setIn(
                        [stepsKey, i, commandsKey, j],
                        command.replace(/^npx lerna (publish) from-package -y/, "npm $1"));
                }
            }
        }

        return [document];
    }
}
