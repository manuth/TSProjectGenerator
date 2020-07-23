import Assert = require("assert");
import { spawnSync } from "child_process";
import { GeneratorSettingKey } from "@manuth/extended-yo-generator";
import { TestContext } from "@manuth/extended-yo-generator-test";
import npmWhich = require("npm-which");
import { ITSGeneratorSettings } from "../../../generators/generator/Settings/ITSGeneratorSettings";
import { SubGeneratorSettingKey } from "../../../generators/generator/Settings/SubGeneratorSettingKey";
import { TSGeneratorComponent } from "../../../generators/generator/Settings/TSGeneratorComponent";
import { TSGeneratorSettingKey } from "../../../generators/generator/Settings/TSGeneratorSettingKey";
import { TSGeneratorGenerator } from "../../../generators/generator/TSGeneratorGenerator";

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
            let settings: ITSGeneratorSettings;
            let generator: TSGeneratorGenerator;

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

                    let runContext = context.ExecuteGenerator();
                    runContext.withPrompts(settings);
                    await runContext.toPromise();
                    generator = runContext.generator;
                });

            test(
                "Checking whether the generated project can be installed…",
                function()
                {
                    this.timeout(0);
                    this.slow(2.5 * 60 * 1000);

                    let result = spawnSync(
                        npmWhich(__dirname).sync("npm"),
                        [
                            "install",
                            "--silent"
                        ],
                        {
                            cwd: generator.destinationPath()
                        });

                    Assert.strictEqual(result.status, 0);
                });

            test(
                "Checking whether the main generator can be executed…",
                () =>
                {
                    let testContext = new TestContext(GeneratorPath(generator, "app"));
                    Assert.doesNotReject(async () => testContext.ExecuteGenerator().toPromise());
                });

            test(
                "Checking whether the sub-generators can be executed…",
                () =>
                {
                    for (let subGeneratorOptions of settings[TSGeneratorSettingKey.SubGenerators])
                    {
                        let testContext = new TestContext(GeneratorPath(generator, subGeneratorOptions[SubGeneratorSettingKey.Name]));
                        Assert.doesNotReject(async () => testContext.ExecuteGenerator().toPromise());
                    }
                });

            test(
                "Checking whether mocha can be executed…",
                function()
                {
                    this.slow(4 * 1000);

                    let result = spawnSync(
                        npmWhich(generator.destinationPath()).sync("mocha"),
                        {
                            cwd: generator.destinationPath()
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
