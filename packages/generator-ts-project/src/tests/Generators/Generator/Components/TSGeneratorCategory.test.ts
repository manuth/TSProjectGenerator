import { doesNotReject, ok } from "assert";
import { spawnSync } from "child_process";
import { GeneratorOptions, GeneratorSettingKey, IComponent, IFileMapping } from "@manuth/extended-yo-generator";
import { IRunContext, TestContext as GeneratorContext } from "@manuth/extended-yo-generator-test";
import { TempDirectory } from "@manuth/temp-files";
import { pathExists } from "fs-extra";
import npmWhich = require("npm-which");
import { GeneratorName } from "../../../../Core/GeneratorName";
import { TSGeneratorCategory } from "../../../../generators/generator/Components/TSGeneratorCategory";
import { NamingContext } from "../../../../generators/generator/FileMappings/TypeScript/NamingContext";
import { ITSGeneratorSettings } from "../../../../generators/generator/Settings/ITSGeneratorSettings";
import { SubGeneratorSettingKey } from "../../../../generators/generator/Settings/SubGeneratorSettingKey";
import { TSGeneratorComponent } from "../../../../generators/generator/Settings/TSGeneratorComponent";
import { TSGeneratorSettingKey } from "../../../../generators/generator/Settings/TSGeneratorSettingKey";
import { TSGeneratorGenerator } from "../../../../generators/generator/TSGeneratorGenerator";
import { TSProjectSettingKey } from "../../../../Project/Settings/TSProjectSettingKey";
import { TestContext } from "../../../TestContext";
import { GeneratorPath } from "../TSGeneratorGenerator.test";

/**
 * Registers tests for the {@link TSGeneratorCategory `TSGeneratorCategory<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function TSGeneratorCategoryTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        nameof(TSGeneratorCategory),
        () =>
        {
            let runContext: IRunContext<TSGeneratorGenerator>;
            let tempDir: TempDirectory;
            let settings: ITSGeneratorSettings;
            let collection: TSGeneratorCategory<ITSGeneratorSettings, GeneratorOptions>;

            /**
             * Provides an implementation of the {@link TSGeneratorCategory `TSGeneratorCategory<TSettings, TOptions>`} class for testing.
             */
            class TestTSGeneratorCategory extends TSGeneratorCategory<any, any>
            {
                /**
                 * Gets a component for creating an example generator.
                 */
                public override get GeneratorComponent(): IComponent<any, any>
                {
                    return super.GeneratorComponent;
                }

                /**
                 * @inheritdoc
                 */
                public override get SubGeneratorComponent(): IComponent<any, any>
                {
                    return super.SubGeneratorComponent;
                }

                /**
                 * @inheritdoc
                 *
                 * @param id
                 * The id of the generator.
                 *
                 * @param displayName
                 * The human readable name of the generator.
                 *
                 * @returns
                 * File-mappings for a generator.
                 */
                public override GetGeneratorFileMappings(id: string, displayName: string): Array<IFileMapping<any, any>>
                {
                    return super.GetGeneratorFileMappings(id, displayName);
                }
            }

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);

                    settings = {
                        ...(await context.Generator).Settings,
                        [TSProjectSettingKey.DisplayName]: "Z",
                        [GeneratorSettingKey.Components]: [
                            TSGeneratorComponent.GeneratorExample,
                            TSGeneratorComponent.SubGeneratorExample
                        ],
                        [TSGeneratorSettingKey.SubGenerators]: [
                            {
                                [SubGeneratorSettingKey.DisplayName]: "A",
                                [SubGeneratorSettingKey.Name]: "a"
                            },
                            {
                                [SubGeneratorSettingKey.DisplayName]: "B",
                                [SubGeneratorSettingKey.Name]: "b"
                            }
                        ]
                    };

                    runContext = context.ExecuteGenerator();
                    runContext.withPrompts(settings);
                    await runContext.toPromise();
                    collection = new TSGeneratorCategory(await context.Generator);

                    spawnSync(
                        npmWhich(__dirname).sync("npm"),
                        [
                            "install",
                            "--silent"
                        ],
                        {
                            cwd: runContext.generator.destinationPath()
                        });

                    spawnSync(
                        npmWhich(__dirname).sync("npm"),
                        [
                            "run",
                            "build"
                        ],
                        {
                            cwd: runContext.generator.destinationPath()
                        });
                });

            setup(
                () =>
                {
                    tempDir = new TempDirectory();
                });

            suite(
                nameof<TSGeneratorCategory<any, any>>((category) => category.Components),
                () =>
                {
                    test(
                        `Checking whether all components for the \`${nameof(TSGeneratorGenerator)}\`s are present…`,
                        async () =>
                        {
                            for (let componentID of [TSGeneratorComponent.GeneratorExample, TSGeneratorComponent.SubGeneratorExample])
                            {
                                ok(collection.Components.some((component) => component.ID === componentID));
                            }
                        });
                });

            suite(
                nameof<TestTSGeneratorCategory>((category) => category.GeneratorComponent),
                () =>
                {
                    test(
                        "Checking whether the generator is created correctly…",
                        async function()
                        {
                            this.timeout(20 * 1000);
                            this.slow(10 * 1000);
                            let testContext = new GeneratorContext(GeneratorPath(runContext.generator, GeneratorName.Main));
                            await doesNotReject(async () => testContext.ExecuteGenerator().inDir(tempDir.FullName).toPromise());
                        });
                });

            suite(
                nameof<TestTSGeneratorCategory>((category) => category.SubGeneratorComponent),
                () =>
                {
                    test(
                        "Checking whether sub-generators are created correctly…",
                        async function()
                        {
                            this.timeout(20 * 1000);
                            this.slow(10 * 1000);

                            for (let subGeneratorOptions of settings[TSGeneratorSettingKey.SubGenerators])
                            {
                                let name = subGeneratorOptions[SubGeneratorSettingKey.Name];
                                let testContext = new GeneratorContext(GeneratorPath(runContext.generator, name));
                                await doesNotReject(async () => testContext.ExecuteGenerator().inDir(tempDir.FullName).toPromise());
                            }
                        });
                });

            suite(
                nameof<TestTSGeneratorCategory>((category) => category.GetGeneratorFileMappings),
                () =>
                {
                    test(
                        "Checking whether test-files for all generators are present…",
                        async () =>
                        {
                            for (
                                let generatorName of
                                [
                                    GeneratorName.Main,
                                    ...runContext.generator.Settings[TSGeneratorSettingKey.SubGenerators].map(
                                        (subGenerator) =>
                                        {
                                            return subGenerator[SubGeneratorSettingKey.Name];
                                        })
                                ])
                            {
                                let namingContext = new NamingContext(generatorName, context.RandomString, generator.SourceRoot);
                                ok(await pathExists(generator.destinationPath("src", "tests", "Generators", `${namingContext.GeneratorClassName}.test.ts`)));
                            }
                        });
                });
        });
}
