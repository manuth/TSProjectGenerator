import Assert = require("assert");
import { spawnSync } from "child_process";
import Path = require("path");
import { GeneratorSettingKey } from "@manuth/extended-yo-generator";
import { TestContext, IRunContext } from "@manuth/extended-yo-generator-test";
import { Package } from "@manuth/package-json-editor";
import dedent = require("dedent");
import { writeFile } from "fs-extra";
import npmWhich = require("npm-which");
import { Random } from "random-js";
import { TempDirectory } from "temp-filesystem";
import { LintRuleset } from "../../Linting/LintRuleset";
import { TSProjectComponent } from "../../Project/Settings/TSProjectComponent";
import { TSProjectSettingKey } from "../../Project/Settings/TSProjectSettingKey";
import { TSGeneratorComponent } from "../../generators/generator/Settings/TSGeneratorComponent";
import { TSGeneratorGenerator } from "../../generators/generator/TSGeneratorGenerator";

suite(
    "TSGenerator-Generator",
    () =>
    {
        let random: Random;
        let generatorDir: TempDirectory;
        let testContext: TestContext<TSGeneratorGenerator>;
        let runContext: IRunContext<TSGeneratorGenerator>;
        let generatorName: string;

        suiteSetup(
            () =>
            {
                random = new Random();
                generatorDir = new TempDirectory();
                generatorName = "generator-test";
                testContext = new TestContext(Path.join(__dirname, "..", "..", "generators", "generator"));

                runContext = testContext.ExecuteGenerator().withPrompts(
                    {
                        [TSProjectSettingKey.Destination]: "./",
                        [TSProjectSettingKey.DisplayName]: generatorName,
                        [TSProjectSettingKey.Name]: generatorName,
                        [GeneratorSettingKey.Components]: [
                            TSProjectComponent.Linting,
                            TSProjectComponent.VSCode,
                            TSGeneratorComponent.GeneratorExample
                        ],
                        [TSProjectSettingKey.LintRuleset]: LintRuleset.Weak
                    }).inDir(
                        generatorDir.FullName
                    );
            });

        suiteTeardown(
            function(): void
            {
                this.timeout(0);
                generatorDir.Dispose();
            });

        suite(
            "General",
            () =>
            {
                test(
                    "Checking whether the generator can be executed…",
                    async function()
                    {
                        this.timeout(0);
                        this.slow(6.5 * 60 * 1000);
                        return Assert.doesNotReject(async () => runContext.toPromise());
                    });

                test(
                    "Checking whether the generated module can be installed…",
                    function()
                    {
                        this.timeout(0);
                        this.slow(3.25 * 60 * 1000);

                        let result = spawnSync(
                            npmWhich(__dirname).sync("npm"),
                            [
                                "install",
                                "--silent"
                            ],
                            {
                                cwd: generatorDir.FullName
                            });

                        Assert.strictEqual(result.status === 0, true);
                    });

                test(
                    "Checking whether the generated module can be compiled using typescript…",
                    async function()
                    {
                        this.timeout(0);
                        this.slow(7.75 * 1000);

                        let result = spawnSync(
                            npmWhich(__dirname).sync("tsc"),
                            [
                                "-p",
                                "."
                            ]);

                        Assert.strictEqual(result.status === 0, true);
                    });

                test(
                    "Checking whether the generated module can be used as a generator…",
                    async function()
                    {
                        this.timeout(0);
                        this.slow(10 * 1000);
                        let testContext = new TestContext(Path.join(generatorDir.FullName, "lib", "generators", "app")).ExecuteGenerator();
                        await Assert.doesNotReject(testContext.toPromise());
                        testContext.cleanTestDirectory();
                    });
            });

        suite(
            "Features",
            () =>
            {
                let tempDir: TempDirectory;

                setup(
                    () =>
                    {
                        tempDir = new TempDirectory();
                    });

                teardown(
                    () =>
                    {
                        tempDir.Dispose();
                    });

                suite(
                    "Settings",
                    () =>
                    {
                        test(
                            "Checking whether the default description is read from the `README` file…",
                            async function()
                            {
                                this.timeout(0);
                                let description = random.string(30);
                                let runContext = testContext.ExecuteGenerator().inDir(tempDir.FullName);

                                await writeFile(
                                    tempDir.MakePath("README.md"),
                                    dedent(
                                        `
                                            # Test
                                            ${description}`));

                                await runContext.toPromise();
                                Assert.strictEqual(runContext.generator.Settings[TSProjectSettingKey.Description], description);
                            });

                        test(
                            "Checking whether repository infos are set automatically…",
                            async function()
                            {
                                this.timeout(0);
                                let npmPackage: Package;
                                let repoLink = "https://github.com/JohnDoe/Example";
                                let runContext = testContext.ExecuteGenerator().inDir(tempDir.FullName);

                                spawnSync(
                                    npmWhich(__dirname).sync("git"),
                                    [
                                        "init"
                                    ]);

                                spawnSync(
                                    npmWhich(__dirname).sync("git"),
                                    [
                                        "remote",
                                        "add",
                                        "origin",
                                        `${repoLink}.git`
                                    ]);

                                await runContext.toPromise();
                                npmPackage = new Package(runContext.generator.destinationPath("package.json"));
                                Assert.strictEqual(npmPackage.Homepage, `${repoLink}#readme`);
                                Assert.ok(typeof npmPackage.Repository !== "string");
                                Assert.strictEqual(npmPackage.Repository.url, `git+${repoLink}.git`);
                                Assert.strictEqual(npmPackage.Bugs.URL, `${repoLink}/issues`);
                            });
                    });
            });
    });
