import { ChoiceType, Question, Separator } from "inquirer";
import Path = require("path");
import { isNullOrUndefined } from "util";
import YeomanGenerator = require("yeoman-generator");
import { Question as YoQuestion, Questions } from "yeoman-generator";
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
    protected get Questions(): Question<T>[]
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
        return this.modulePath("templates", this.TemplateRoot, ...path);
    }

    /**
     * Joins the arguments together and returns the resulting path relative to the module-directory.
     *
     * @param path
     * The path that is to be joined.
     */
    public modulePath(...path: string[])
    {
        return Path.join(__dirname, "..", ...path);
    }

    /**
     * Gathers all information for executing the generator and saves them to the `Settings`.
     */
    public async prompting()
    {
        let questions: Questions = [];
        let components: ChoiceType[] = [];
        let defaults: string[] = [];

        if (this.ProvidedComponents !== null)
        {
            for (let category of this.ProvidedComponents.Categories)
            {
                components.push(new Separator(category.DisplayName));

                for (let component of category.Components)
                {
                    let isDefault = !isNullOrUndefined(component.Default) && component.Default;

                    components.push({
                        value: component.ID,
                        name: component.DisplayName,
                        checked: isDefault
                    });

                    if (isDefault)
                    {
                        defaults.push(component.ID);
                    }

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

                                if (!isNullOrUndefined(fileMapping.Destination.Settings))
                                {
                                    Object.assign(question, fileMapping.Destination.Settings);
                                }

                                if (!isNullOrUndefined(fileMapping.Destination.Default))
                                {
                                    question.default = fileMapping.Destination.Default;
                                }

                                questions.push(question as YoQuestion);
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
                    choices: components,
                    default: defaults
                });
        }

        questions.unshift(...this.Questions as YoQuestion[]);
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
                    let settingsIndex = 0;
                    let fileMappings = await this.ResolveValue(component.FileMappings, this.Settings);

                    for (let fileMapping of fileMappings)
                    {
                        let sourcePath: string = await this.ResolveValue(fileMapping.Source, this.Settings);
                        let destinationPath: string;

                        if (
                            typeof fileMapping.Destination === "string" ||
                            typeof fileMapping.Destination === "function")
                        {
                            destinationPath = await this.ResolveValue(fileMapping.Destination, this.Settings);
                        }
                        else
                        {
                            destinationPath = this.Settings[GeneratorSetting.ComponentPaths][component.ID][settingsIndex++];
                        }

                        sourcePath = (isNullOrUndefined(sourcePath) || Path.isAbsolute(sourcePath)) ? sourcePath : this.templatePath(sourcePath);
                        destinationPath = (isNullOrUndefined(destinationPath) || Path.isAbsolute(destinationPath)) ? destinationPath : this.destinationPath(destinationPath);

                        let context = await this.ResolveValue(fileMapping.Context, this.Settings, sourcePath, destinationPath);
                        let defaultProcessor = (sourcePath: string, destinationPath: string, context: any) =>
                        {
                            if (
                                !isNullOrUndefined(sourcePath) &&
                                !isNullOrUndefined(destinationPath))
                            {
                                if (isNullOrUndefined(context))
                                {
                                    this.fs.copy(sourcePath, destinationPath);
                                }
                                else
                                {
                                    this.fs.copyTpl(sourcePath, destinationPath, context);
                                }
                            }
                        };

                        if (isNullOrUndefined(fileMapping.Processor))
                        {
                            defaultProcessor(sourcePath, destinationPath, context);
                        }
                        else
                        {
                            let result = fileMapping.Processor(sourcePath, destinationPath, context, defaultProcessor, this.Settings);

                            if (result instanceof Promise)
                            {
                                await result;
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
    protected async ResolveValue<TSource extends any[], TValue>(value: (TValue | ((...settings: TSource) => TValue) | ((...settings: TSource) => Promise<TValue>)), ...source: TSource)
    {
        if (value instanceof Function)
        {
            let result = value(...source);

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