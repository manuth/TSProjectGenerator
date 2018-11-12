import Assert = require("assert");
import FileSystem = require("fs-extra");
import NPM = require("npm");
import Path = require("path");
import TS = require("typescript");
import { isNullOrUndefined } from "util";
import { run, RunContext } from "yeoman-test";
import { AppComponent } from "../../generators/app/AppComponent";
import { AppSetting } from "../../generators/app/AppSetting";
import { LintMode } from "../../generators/app/LintMode";
import { GeneratorSetting } from "../../GeneratorSetting";

suite(
    "Generator-Generator",
    () =>
    {
        let currentDir: string;
        let generatorDir: string;
        let tsConfigFile: string;
        let runContext: RunContext;
        let generatorName: string;

        suiteSetup(
            () =>
            {
                currentDir = process.cwd();
                generatorName = "generator-test";
                runContext = run(
                    Path.join(__dirname, "..", "..", "generators", "app")).withPrompts(
                        {
                            [AppSetting.Destination]: "./",
                            [AppSetting.Name]: generatorName,
                            [AppSetting.ModuleName]: generatorName,
                            [GeneratorSetting.Components]: [
                                AppComponent.TSLint,
                                AppComponent.VSCode,
                                AppComponent.GeneratorExample
                            ],
                            [AppSetting.LintMode]: LintMode.Weak
                        });
            });

        suiteTeardown(
            function (): void
            {
                this.slow(1 * 60 * 1000);
                this.timeout(1 * 60 * 1000);
                process.chdir(currentDir);
                runContext.cleanTestDirectory();
            });

        test(
            "Checking whether the generator can be executed…",
            async function ()
            {
                this.slow(5 * 1000);
                this.timeout(5 * 1000);
                generatorDir = await runContext;
                tsConfigFile = Path.join(generatorDir, "tsconfig.json");
            });

        test(
            "Checking whether the generated module can be installed…",
            async function ()
            {
                this.slow(5 * 60 * 1000);
                this.timeout(5 * 60 * 1000);

                let consoleLog = console.log;
                console.log = () => { };

                try
                {
                    await new Promise(
                        (resolve, reject) =>
                        {
                            NPM.load(
                                {
                                    loaded: false
                                } as any,
                                (error, result) =>
                                {
                                    if (!isNullOrUndefined(error))
                                    {
                                        reject(error);
                                    }
                                    else
                                    {
                                        resolve(result);
                                    }
                                });
                        });

                    await new Promise(
                        (resolve, reject) =>
                        {
                            NPM.commands.install(
                                [],
                                (error, result) =>
                                {
                                    if (!isNullOrUndefined(error))
                                    {
                                        reject(error);
                                    }
                                    else
                                    {
                                        resolve(result);
                                    }
                                });
                        });
                }
                catch (error)
                {
                    console.log = consoleLog;
                    throw error;
                }
                finally
                {
                    console.log = consoleLog;
                }
            });

        test(
            "Checking whether the generated module contains a typescript-configuration…",
            async () => Assert.strictEqual(await FileSystem.pathExists(tsConfigFile), true));

        test(
            "Checking whether the generated module can be compiled using typescript…",
            function ()
            {
                this.slow(20 * 1000);
                this.timeout(20 * 1000);

                let host: TS.ParseConfigFileHost = {
                    ...TS.sys,
                    onUnRecoverableConfigFileDiagnostic: (diagnostic) =>
                    {
                        throw diagnostic;
                    }
                };

                let config: TS.ParsedCommandLine = TS.getParsedCommandLineOfConfigFile(tsConfigFile, {}, host);
                let compilerResult = TS.createProgram(
                    {
                        rootNames: config.fileNames,
                        options: config.options
                    }).emit();

                Assert.strictEqual(compilerResult.emitSkipped, false);
            });

        test(
            "Checking whether the generated module can be used as a generator…",
            async () =>
            {
                let testContext = run(Path.join(generatorDir, "lib", "generators", "app"));
                Assert.doesNotReject(testContext.toPromise());
                testContext.cleanTestDirectory();
            });
    });