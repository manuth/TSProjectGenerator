import { ok, strictEqual } from "assert";
import { GeneratorOptions, IFileMapping, IGenerator, IGeneratorSettings, Predicate } from "@manuth/extended-yo-generator";
import { PackageJSONConverter, TextConverter } from "@manuth/generator-ts-project";
import { DependencyCollection, Package } from "@manuth/package-json-editor";
import { ConvertibleFileMappingTester } from "./ConvertibleFileMappingTester";

/**
 * Provides the functionality to test `package.json` file-mappings.
 *
 * @template TGenerator
 * The type of the generator for testing the file-mapping.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 *
 * @template TFileMapping
 * The type of the file-mapping to test.
 */
export class PackageFileMappingTester<TGenerator extends IGenerator<TSettings, TOptions>, TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions, TFileMapping extends IFileMapping<TSettings, TOptions>> extends ConvertibleFileMappingTester<TGenerator, TSettings, TOptions, TFileMapping, Package>
{
    /**
     * Initializes a new instance of the {@link PackageFileMappingTester `PackageFileMappingTester<TGenerator, TSettings, TOptions, TFileMapping>`} class.
     *
     * @param generator
     * The generator of the file-mapping
     *
     * @param fileMapping
     * The file-mapping to test.
     */
    public constructor(generator: TGenerator, fileMapping: TFileMapping)
    {
        super(generator, fileMapping);
    }

    /**
     * @inheritdoc
     */
    public get Converter(): TextConverter<Package>
    {
        return new PackageJSONConverter(this.FileMapping.Destination);
    }

    /**
     * Asserts that the dependencies are present in the output-package.
     *
     * @param dependencies
     * The expected dependencies.
     */
    public async AssertDependencies(dependencies: DependencyCollection): Promise<void>;

    /**
     * Asserts the existence of the specified {@link dependencies `dependencies`}.
     *
     * @param dependencies
     * The dependencies to check.
     *
     * @param present
     * A value indicating whether the specified {@link dependencies `dependencies`} are expected to be present.
     */
    public async AssertDependencies(dependencies: DependencyCollection, present: boolean): Promise<void>;

    /**
     * Asserts the existence of the specified {@link dependencies `dependencies`}.
     *
     * @param dependencies
     * The dependencies to check.
     *
     * @param present
     * A value indicating whether the specified {@link dependencies `dependencies`} are expected to be present.
     *
     * @param exactVersion
     * A value indicating whether the versions of the specified {@link dependencies `dependencies`} are expected to be exactly equal.
     */
    public async AssertDependencies(dependencies: DependencyCollection, present: true, exactVersion: boolean): Promise<void>;

    /**
     * Asserts the existence of the specified {@link dependencies `dependencies`}.
     *
     * @param dependencies
     * The dependencies to check.
     *
     * @param present
     * A value indicating whether the specified {@link dependencies `dependencies`} are expected to be present.
     *
     * @param exactVersion
     * A value indicating whether the versions of the specified {@link dependencies `dependencies`} are expected to be exactly equal.
     */
    public async AssertDependencies(dependencies: DependencyCollection, present = true, exactVersion = true): Promise<void>
    {
        let npmPackage = await this.ParseOutput();

        let dependencyListSets = [
            [dependencies.Dependencies, npmPackage.Dependencies],
            [dependencies.DevelopmentDependencies, npmPackage.DevelopmentDependencies],
            [dependencies.PeerDependencies, npmPackage.PeerDependencies],
            [dependencies.OptionalDependencies, npmPackage.OptionalDependencies]
        ];

        for (let dependencyListSet of dependencyListSets)
        {
            for (let dependency of dependencyListSet[0].Entries)
            {
                strictEqual(
                    dependencyListSet[1].Has(dependency[0]),
                    present,
                    `The package ${present ? "doesn't include" : "includes"} the${present ? "" : " unwanted"} dependency \`${dependency[0]}\`!`);

                if (present && exactVersion)
                {
                    strictEqual(
                        dependencyListSet[1].Get(dependency[0]),
                        dependency[1],
                        `The package's version of the dependency \`${dependency[0]}\` is incorrect! Expected \`${dependency[1]}\`, but got \`${dependencyListSet[1].Get(dependency[0])}\`!`);
                }
            }
        }

        for (let dependency of dependencies.BundledDependencies.Values)
        {
            ok(
                npmPackage.BundledDependencies.Contains(dependency) === present,
                `The package ${present ? "doesn't include" : "includes"} the${present ? "" : " unwanted"} dependency \`${dependency[0]}\`!`);
        }
    }

    /**
     * Asserts the truthiness of the {@link predicate `predicate`} on the script with the specified {@link name `name`}.
     *
     * @param name
     * The name of the script to check.
     *
     * @param predicate
     * The predicate to check the script with the specified {@link name `name`} for.
     */
    public async AssertScript(name: string, predicate: Predicate<string>): Promise<void>;

    /**
     * Asserts the content of the script with the specified {@link name `name`}.
     *
     * @param name
     * The name of the script to check.
     *
     * @param content
     * The expected content.
     */
    public async AssertScript(name: string, content: string): Promise<void>;

    /**
     * Asserts the truthiness of the {@link predicate `predicate`} on the script with the specified {@link name `name`}.
     *
     * @param name
     * The name of the script to check.
     *
     * @param predicate
     * The predicate to check the script with the specified {@link name `name`} for.
     */
    public async AssertScript(name: string, predicate: Predicate<string> | string): Promise<void>
    {
        let script = (await this.ParseOutput()).Scripts.Get(name);
        let innerPredicate: Predicate<string>;

        if (typeof predicate === "string")
        {
            innerPredicate = (script) => script === predicate;
        }
        else
        {
            innerPredicate = predicate;
        }

        ok(innerPredicate(script));
    }
}
