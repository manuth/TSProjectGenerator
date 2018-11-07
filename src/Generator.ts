import { ChoiceType, Question, Separator } from "inquirer";
import Path = require("path");
import { isNullOrUndefined } from "util";
import YeomanGenerator = require("yeoman-generator");
import { GeneratorSetting } from "./GeneratorSetting";
import { IComponentProvider } from "./IComponentProvider";
import { IGeneratorSettings } from "./IGeneratorSettings";

/**
 * Represents a yeoman-generator.
 */
export abstract class Generator<T extends IGeneratorSettings = IGeneratorSettings> extends YeomanGenerator
{
    /**
     * The settings of the generator.
     */
    private settings: T = {} as T;

    /**
     * Initializes a new instance of the `Generator` class.
     *
     * @param args
     * A set of arguments for the generator.
     *
     * @param options
     * A set of options for the generator.
     */
    public constructor(args: string | string[], options: {})
    {
        super(args, options);
    }

    /**
     * Gets the name of the root of the template-folder.
     */
    protected abstract get TemplateRoot(): string;

    /**
     * Gets the questions to ask before executing the generator.
     */
    protected get Questions(): YeomanGenerator.Question[]
    {
        return [];
    }

    /**
     * Gets the components provided by the generator.
     */
    protected get ProvidedComponents(): IComponentProvider<T>
    {
        return null;
    }

    /**
     * Gets the settings of the generator.
     */
    protected get Settings()
    {
        return this.settings;
    }

    /**
     * Joins the arguments together and returns the resulting path relative to the template-directory.
     *
     * @param path
     * The path that is to be joined.
     */
    public templatePath(...path: string[])
    {
        return Path.join(__dirname, "..", "templates", this.TemplateRoot, ...path);
    }

    /**
     * Gathers all information for executing the generator and saves them to the `Settings`.
     */
    public async prompting()
    {
        let questions: YeomanGenerator.Questions = [];
        let components: ChoiceType[] = [];

        if (this.ProvidedComponents !== null)
        {
            for (let category of this.ProvidedComponents.Categories)
            {
                components.push(new Separator(category.DisplayName));

                for (let component of category.Components)
                {
                    components.push({
                        value: component.ID,
                        name: component.DisplayName,
                        checked: !isNullOrUndefined(component.Default) && component.Default
                    });

                    if (typeof component.FileMappings !== "function")
                    {
                        for (let i in component.FileMappings)
                        {
                            let fileMapping = component.FileMappings[i];

                            if (
                                typeof fileMapping.Destination !== "string" &&
                                typeof fileMapping.Destination !== "function")
                            {
                                let question: Question<T> = {
                                    type: "input",
                                    name: `${GeneratorSetting.ComponentPaths}[${JSON.stringify(component.ID)}][${i}]`,
                                    message: fileMapping.Destination.Message,
                                    when: answers =>
                                    {
                                        return answers[GeneratorSetting.Components].includes(component.ID);
                                    }
                                };

                                if (!isNullOrUndefined(fileMapping.Destination.Default))
                                {
                                    question.default = fileMapping.Destination.Default;
                                }

                                questions.push(question as YeomanGenerator.Question);
                            }
                        }
                    }

                    if (!isNullOrUndefined(component.Questions))
                    {
                        for (let question of component.Questions)
                        {
                            if (isNullOrUndefined(question.when))
                            {
                                question.when = (settings: T) => settings[GeneratorSetting.Components].includes(component.ID);
                            }

                            questions.push(question as Question);
                        }
                    }
                }
            }

            questions.unshift(
                {
                    type: "checkbox",
                    name: GeneratorSetting.Components,
                    message: this.ProvidedComponents.Question,
                    choices: components
                });
        }

        questions.unshift(...this.Questions);
        Object.assign(this.Settings, await this.prompt(questions));
    }

    /**
     * Writes all files for the components.
     */
    public async writing()
    {
        for (let category of this.ProvidedComponents.Categories)
        {
            for (let component of category.Components)
            {
                if (this.Settings[GeneratorSetting.Components].includes(component.ID))
                {
                    let fileMappings = await this.ResolveValue(this.Settings, component.FileMappings);

                    for (let fileMapping of fileMappings)
                    {
                        if (
                            !isNullOrUndefined(fileMapping.Source) &&
                            !isNullOrUndefined(fileMapping.Destination))
                        {
                            let sourcePath: string = await this.ResolveValue(this.Settings, fileMapping.Source);
                            let destinationPath: string;

                            if (
                                typeof fileMapping.Destination === "string" ||
                                typeof fileMapping.Destination === "function")
                            {
                                destinationPath = await this.ResolveValue(this.Settings, fileMapping.Destination);
                            }
                            else
                            {
                                destinationPath = this.Settings[GeneratorSetting.ComponentPaths][component.ID];
                            }

                            let context = await this.ResolveValue(this.Settings, fileMapping.Context);
                            sourcePath = Path.isAbsolute(sourcePath) ? sourcePath : this.templatePath(sourcePath);
                            destinationPath = Path.isAbsolute(destinationPath) ? destinationPath : this.destinationPath(destinationPath);

                            if (isNullOrUndefined(context))
                            {
                                this.fs.copy(sourcePath, destinationPath);
                            }
                            else
                            {
                                this.fs.copyTpl(sourcePath, destinationPath, context);
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * Installs all required dependencies.
     */
    public async install()
    {
    }

    /**
     * Finalizes the generation-process.
     */
    public async end()
    {
    }

    /**
     * Resolves a value no matter whether it is wrapped in a function or not.
     *
     * @param settings
     * The settings to use for resolving the value.
     *
     * @param value
     * The value to resolve.
     */
    private async ResolveValue<TValue>(settings: T, value: TValue | ((settings?: T) => TValue) | ((settings?: T) => Promise<TValue>))
    {
        if (value instanceof Function)
        {
            let result = value(settings);

            if (result instanceof Promise)
            {
                return result;
            }
            else
            {
                return result;
            }
        }
        else
        {
            return value;
        }
    }
}