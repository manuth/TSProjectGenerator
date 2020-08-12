import Assert = require("assert");
import { spawnSync } from "child_process";
import { GeneratorSettingKey } from "@manuth/extended-yo-generator";
import { TestContext as GeneratorContext, IRunContext } from "@manuth/extended-yo-generator-test";
import npmWhich = require("npm-which");
import { TempDirectory } from "temp-filesystem";
import { TSGeneratorCodeWorkspace } from "../../../../generators/generator/Components/TSGeneratorCodeWorkspace";
import { TSGeneratorGeneralCategory } from "../../../../generators/generator/Components/TSGeneratorGeneralCategory";
import { ITSGeneratorSettings } from "../../../../generators/generator/Settings/ITSGeneratorSettings";
import { SubGeneratorSettingKey } from "../../../../generators/generator/Settings/SubGeneratorSettingKey";
import { TSGeneratorComponent } from "../../../../generators/generator/Settings/TSGeneratorComponent";
import { TSGeneratorSettingKey } from "../../../../generators/generator/Settings/TSGeneratorSettingKey";
import { TSGeneratorGenerator } from "../../../../generators/generator/TSGeneratorGenerator";
import { TestContext } from "../../../TestContext";
import { GeneratorPath } from "../TSGeneratorGenerator.test";

/**
 * Registers tests for the `TSGeneratorGeneralCategory` class.
 *
 * @param context
 * The test-context.
 */
export function TSGeneratorGeneralCategoryTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        "TSGeneratorGeneralCategory",
        () =>
        {
            let runContext: IRunContext<TSGeneratorGenerator>;
            let tempDir: TempDirectory;
            let settings: ITSGeneratorSettings;
            let collection: TSGeneratorGeneralCategory<ITSGeneratorSettings>;

            suiteSetup(
                async function()
                {
                    this.timeout(0);

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
                    collection = new TSGeneratorGeneralCategory(await context.Generator);

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

            teardown(
                function()
                {
                    this.timeout(0);
                    tempDir.Dispose();
                });

            test(
                "Checking whether all components for `TSGenerator`s are present…",
                async () =>
                {
                    for (let componentType of [TSGeneratorCodeWorkspace])
                    {
                        Assert.ok((collection.Components).some((component) => component instanceof componentType));
                    }

                    for (let componentID of [TSGeneratorComponent.GeneratorExample, TSGeneratorComponent.SubGeneratorExample])
                    {
                        Assert.ok((collection.Components).some((component) => component.ID === componentID));
                    }
                });

            test(
                "Checking whether the generator is created correctly…",
                async function()
                {
                    this.timeout(0);
                    this.slow(10 * 1000);
                    let testContext = new GeneratorContext(GeneratorPath(runContext.generator, "app"));
                    await Assert.doesNotReject(async () => testContext.ExecuteGenerator().inDir(tempDir.FullName).toPromise());
                });

            test(
                "Checking whether sub-generators are created correctly…",
                async function()
                {
                    this.timeout(0);
                    this.slow(10 * 1000);

                    for (let subGeneratorOptions of settings[TSGeneratorSettingKey.SubGenerators])
                    {
                        let name = subGeneratorOptions[SubGeneratorSettingKey.Name];
                        let testContext = new GeneratorContext(GeneratorPath(runContext.generator, name));
                        await Assert.doesNotReject(async () => testContext.ExecuteGenerator().inDir(tempDir.FullName).toPromise());
                    }
                });
        });
}
