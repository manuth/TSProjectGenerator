import Assert = require("assert");
import { spawnSync } from "child_process";
import { GeneratorSettingKey } from "@manuth/extended-yo-generator";
import { IRunContext, TestContext as GeneratorContext } from "@manuth/extended-yo-generator-test";
import { TempDirectory } from "@manuth/temp-files";
import npmWhich = require("npm-which");
import { ITSGeneratorSettings } from "../../../generators/generator/Settings/ITSGeneratorSettings";
import { SubGeneratorSettingKey } from "../../../generators/generator/Settings/SubGeneratorSettingKey";
import { TSGeneratorComponent } from "../../../generators/generator/Settings/TSGeneratorComponent";
import { TSGeneratorSettingKey } from "../../../generators/generator/Settings/TSGeneratorSettingKey";
import { TSGeneratorGenerator } from "../../../generators/generator/TSGeneratorGenerator";
import { TestContext } from "../../TestContext";

/**
 * Registers tests for the `TSGeneratorGenerator` class.
 *
 * @param context
 * The test-context.
 */
export function TSGeneratorGeneratorTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        "TSGeneratorGenerator",
        () =>
        {
            let tempDir: TempDirectory;
            let mainContext: IRunContext<TSGeneratorGenerator>;
            let settings: ITSGeneratorSettings;

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

                    mainContext = context.ExecuteGenerator();
                    mainContext.withPrompts(settings);
                    await mainContext.toPromise();
                });

            suiteTeardown(
                function()
                {
                    this.timeout(0);
                    mainContext.cleanTestDirectory();
                });

            setup(
                () =>
                {
                    tempDir = new TempDirectory();
                });

            test(
                "Checking whether the generated project can be installed…",
                function()
                {
                    this.timeout(0);
                    this.slow(2.5 * 60 * 1000);

                    let installationResult = spawnSync(
                        npmWhich(__dirname).sync("npm"),
                        [
                            "install",
                            "--silent"
                        ],
                        {
                            cwd: mainContext.generator.destinationPath()
                        });

                    let buildResult = spawnSync(
                        npmWhich(__dirname).sync("npm"),
                        [
                            "run",
                            "build"
                        ],
                        {
                            cwd: mainContext.generator.destinationPath()
                        });

                    Assert.strictEqual(installationResult.status, 0);
                    Assert.strictEqual(buildResult.status, 0);
                });

            test(
                "Checking whether the main generator can be executed…",
                async function()
                {
                    this.timeout(0);
                    this.slow(10 * 1000);
                    let testContext = new GeneratorContext(GeneratorPath(mainContext.generator, "app"));
                    return Assert.doesNotReject(async () => testContext.ExecuteGenerator().inDir(tempDir.FullName).toPromise());
                });

            test(
                "Checking whether the sub-generators can be executed…",
                async function()
                {
                    this.timeout(0);
                    this.slow(10 * 1000);

                    for (let subGeneratorOptions of settings[TSGeneratorSettingKey.SubGenerators])
                    {
                        let testContext = new GeneratorContext(GeneratorPath(mainContext.generator, subGeneratorOptions[SubGeneratorSettingKey.Name]));
                        await Assert.doesNotReject(async () => testContext.ExecuteGenerator().inDir(tempDir.FullName).toPromise());
                    }
                });

            test(
                "Checking whether mocha can be executed…",
                function()
                {
                    this.timeout(0);
                    this.slow(4 * 1000);

                    let result = spawnSync(
                        npmWhich(mainContext.generator.destinationPath()).sync("mocha"),
                        {
                            cwd: mainContext.generator.destinationPath()
                        });

                    Assert.strictEqual(result.status, 0);
                });
        });
}

/**
 * Joins the specified `path` relative to the generator-directory.
 *
 * @param generator
 * The generator that created the generator-directory.
 *
 * @param path
 * The path to join.
 *
 * @returns
 * The joined path.
 */
export function GeneratorPath(generator: TSGeneratorGenerator, ...path: string[]): string
{
    return generator.destinationPath("lib", "generators", ...path);
}
