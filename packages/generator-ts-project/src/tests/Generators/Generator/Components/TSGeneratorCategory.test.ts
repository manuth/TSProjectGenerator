import { doesNotReject, ok } from "assert";
import { spawnSync } from "child_process";
import { GeneratorOptions, GeneratorSettingKey } from "@manuth/extended-yo-generator";
import { IRunContext, TestContext as GeneratorContext } from "@manuth/extended-yo-generator-test";
import { TempDirectory } from "@manuth/temp-files";
import npmWhich = require("npm-which");
import { TSGeneratorCategory } from "../../../../generators/generator/Components/TSGeneratorCategory";
import { ITSGeneratorSettings } from "../../../../generators/generator/Settings/ITSGeneratorSettings";
import { SubGeneratorSettingKey } from "../../../../generators/generator/Settings/SubGeneratorSettingKey";
import { TSGeneratorComponent } from "../../../../generators/generator/Settings/TSGeneratorComponent";
import { TSGeneratorSettingKey } from "../../../../generators/generator/Settings/TSGeneratorSettingKey";
import { TSGeneratorGenerator } from "../../../../generators/generator/TSGeneratorGenerator";
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
        "TSGeneratorCategory",
        () =>
        {
            let runContext: IRunContext<TSGeneratorGenerator>;
            let tempDir: TempDirectory;
            let settings: ITSGeneratorSettings;
            let collection: TSGeneratorCategory<ITSGeneratorSettings, GeneratorOptions>;

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);

                    settings = {
                        ...(await context.Generator).Settings,
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

            test(
                "Checking whether all components for `TSGenerator`s are present…",
                async () =>
                {
                    for (let componentID of [TSGeneratorComponent.GeneratorExample, TSGeneratorComponent.SubGeneratorExample])
                    {
                        ok(collection.Components.some((component) => component.ID === componentID));
                    }
                });

            test(
                "Checking whether the generator is created correctly…",
                async function()
                {
                    this.timeout(20 * 1000);
                    this.slow(10 * 1000);
                    let testContext = new GeneratorContext(GeneratorPath(runContext.generator, "app"));
                    await doesNotReject(async () => testContext.ExecuteGenerator().inDir(tempDir.FullName).toPromise());
                });

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
}
