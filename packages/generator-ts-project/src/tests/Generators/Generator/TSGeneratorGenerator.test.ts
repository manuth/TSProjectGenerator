import { doesNotReject, ok, strictEqual } from "node:assert";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { GeneratorSettingKey } from "@manuth/extended-yo-generator";
import { IRunContext, TestContext as GeneratorContext } from "@manuth/extended-yo-generator-test";
import { TempDirectory } from "@manuth/temp-files";
import Mocha from "mocha";
import npmWhich from "npm-which";
import { GeneratorName } from "../../../Core/GeneratorName.js";
import { NamingContext } from "../../../generators/generator/FileMappings/TypeScript/NamingContext.js";
import { ITSGeneratorSettings } from "../../../generators/generator/Settings/ITSGeneratorSettings.js";
import { SubGeneratorSettingKey } from "../../../generators/generator/Settings/SubGeneratorSettingKey.js";
import { TSGeneratorComponent } from "../../../generators/generator/Settings/TSGeneratorComponent.js";
import { TSGeneratorSettingKey } from "../../../generators/generator/Settings/TSGeneratorSettingKey.js";
import { TSGeneratorGenerator } from "../../../generators/generator/TSGeneratorGenerator.js";
import { TSProjectSettingKey } from "../../../Project/Settings/TSProjectSettingKey.js";
import { TestContext } from "../../TestContext.js";

/**
 * Registers tests for the {@link TSGeneratorGenerator `TSGeneratorGenerator<TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function TSGeneratorGeneratorTests(context: TestContext<TSGeneratorGenerator>): void
{
    suite(
        nameof(TSGeneratorGenerator),
        () =>
        {
            let npmPath: string;
            let tempDir: TempDirectory;
            let runContext: IRunContext<TSGeneratorGenerator>;
            let testContext: IRunContext<TSGeneratorGenerator>;
            let generator: TSGeneratorGenerator;
            let settings: ITSGeneratorSettings;
            context.RegisterWorkingDirRestorer();

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    npmPath = npmWhich(fileURLToPath(new URL(".", import.meta.url))).sync("npm");

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
                    generator = runContext.generator;

                    spawnSync(
                        npmPath,
                        [
                            "install",
                            "--silent"
                        ],
                        {
                            cwd: generator.destinationPath(),
                            stdio: "ignore"
                        });

                    spawnSync(
                        npmPath,
                        [
                            "run",
                            "build"
                        ],
                        {
                            cwd: generator.destinationPath(),
                            stdio: "ignore"
                        });
                });

            suiteTeardown(
                function()
                {
                    this.timeout(1 * 60 * 1000);
                    runContext.cleanTestDirectory();
                });

            setup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    tempDir = new TempDirectory();
                    testContext = context.ExecuteGenerator();
                    await testContext.toPromise();
                });

            teardown(
                function()
                {
                    this.timeout(1 * 60 * 1000);
                    testContext.cleanTestDirectory();
                });

            suite(
                "General",
                () =>
                {
                    test(
                        "Checking whether the generated project can be installed…",
                        function()
                        {
                            this.timeout(10 * 60 * 1000);
                            this.slow(5 * 60 * 1000);

                            let installationResult = spawnSync(
                                npmPath,
                                [
                                    "install",
                                    "--silent"
                                ],
                                {
                                    cwd: testContext.generator.destinationPath(),
                                    stdio: "ignore"
                                });

                            let buildResult = spawnSync(
                                npmPath,
                                [
                                    "run",
                                    "build"
                                ],
                                {
                                    cwd: testContext.generator.destinationPath(),
                                    stdio: "ignore"
                                });

                            strictEqual(installationResult.status, 0);
                            strictEqual(buildResult.status, 0);
                        });

                    test(
                        "Checking whether the main generator can be executed…",
                        async function()
                        {
                            this.timeout(1 * 60 * 1000);
                            this.slow(30 * 1000);
                            let testContext = new TestContext(new GeneratorContext(GeneratorPath(generator, GeneratorName.Main)));
                            return doesNotReject(async () => testContext.ExecuteGenerator().inDir(tempDir.FullName).toPromise());
                        });

                    test(
                        "Checking whether the sub-generators can be executed…",
                        async function()
                        {
                            this.timeout(20 * 1000);
                            this.slow(10 * 1000);

                            for (let subGeneratorOptions of settings[TSGeneratorSettingKey.SubGenerators])
                            {
                                let testContext = new TestContext(new GeneratorContext(GeneratorPath(generator, subGeneratorOptions[SubGeneratorSettingKey.Name])));
                                await doesNotReject(async () => testContext.ExecuteGenerator().inDir(tempDir.FullName).toPromise());
                            }
                        });

                    test(
                        "Checking whether mocha can be executed…",
                        function()
                        {
                            this.timeout(8 * 1000);
                            this.slow(4 * 1000);

                            let result = spawnSync(
                                npmWhich(generator.destinationPath()).sync("mocha"),
                                {
                                    cwd: generator.destinationPath(),
                                    stdio: "ignore"
                                });

                            strictEqual(result.status, 0);
                        });
                });

            suite(
                nameof<TSGeneratorGenerator>((generator) => generator.FileMappings),
                () =>
                {
                    test(
                        "Checking whether all tests of the generated project are being included…",
                        async function()
                        {
                            this.timeout(4 * 1000);
                            this.slow(2 * 1000);
                            let suiteNames: string[] = [];

                            let mocha = new Mocha(
                                {
                                    ui: "tdd",
                                    dryRun: true,
                                    reporter: class extends Mocha.reporters.Base
                                    {
                                        /**
                                         * @inheritdoc
                                         *
                                         * @param runner
                                         * The mocha runner.
                                         *
                                         * @param options
                                         * The options which were passed to mocha.
                                         */
                                        public constructor(runner: Mocha.Runner, options: Mocha.MochaOptions)
                                        {
                                            super(runner, options);
                                            runner.on(
                                                "suite",
                                                () =>
                                                {
                                                    suiteNames.push(runner.suite.title);
                                                });
                                        }
                                    }
                                });

                            mocha.addFile(generator.destinationPath("lib", "tests", "main.test.js"));
                            await mocha.loadFilesAsync();
                            await new Promise((resolve) => mocha.run(resolve));

                            for (
                                let generatorName of
                                [
                                    GeneratorName.Main,
                                    ...generator.Settings[TSGeneratorSettingKey.SubGenerators].map(
                                        (subGenerator) =>
                                        {
                                            return subGenerator[SubGeneratorSettingKey.Name];
                                        })
                                ])
                            {
                                let namingContext = new NamingContext(generatorName, context.RandomString, generator.SourceRoot, true);
                                ok(suiteNames.includes(namingContext.GeneratorClassName));
                            }
                        });
                });
        });
}

/**
 * Joins the specified {@link path `path`} relative to the generator-directory.
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
