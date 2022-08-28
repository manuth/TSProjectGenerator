import { doesNotThrow, strictEqual } from "assert";
import { spawnSync } from "child_process";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { IRunContext } from "@manuth/extended-yo-generator-test";
import npmWhich from "npm-which";
import { TSModuleGenerator } from "../../../generators/module/TSModuleGenerator.js";
import { TestContext } from "../../TestContext.js";

/**
 * Registers tests for the {@link TSModuleGenerator `TSModuleGenerator<TSettings, TOptions>`}.
 *
 * @param context
 * The test-context.
 */
export function TSModuleGeneratorTests(context: TestContext<TSModuleGenerator>): void
{
    suite(
        nameof(TSModuleGenerator),
        () =>
        {
            let npmPath: string;
            let runContext: IRunContext<TSModuleGenerator>;
            let generator: TSModuleGenerator;
            let testContext: IRunContext<TSModuleGenerator>;
            context.RegisterWorkingDirRestorer();

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    npmPath = npmWhich(fileURLToPath(new URL(".", import.meta.url))).sync("npm");
                    runContext = context.ExecuteGenerator();
                    await runContext.toPromise();
                    generator = runContext.generator;

                    spawnSync(
                        npmPath,
                        [
                            "install",
                            "--silent"
                        ],
                        {
                            cwd: generator.destinationPath()
                        });

                    spawnSync(
                        npmPath,
                        [
                            "run",
                            "build"
                        ],
                        {
                            cwd: generator.destinationPath()
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
                    testContext = context.ExecuteGenerator();
                    await testContext.toPromise();
                });

            teardown(
                function()
                {
                    this.timeout(1 * 60 * 1000);
                    testContext.cleanTestDirectory();
                });

            test(
                "Checking whether the generated project can be installed…",
                function()
                {
                    this.timeout(6 * 60 * 1000);
                    this.slow(3 * 60 * 1000);

                    let installationResult = spawnSync(
                        npmPath,
                        [
                            "install",
                            "--silent"
                        ],
                        {
                            cwd: testContext.generator.destinationPath()
                        });

                    let buildResult = spawnSync(
                        npmPath,
                        [
                            "run",
                            "build"
                        ],
                        {
                            cwd: testContext.generator.destinationPath()
                        });

                    strictEqual(installationResult.status, 0);
                    strictEqual(buildResult.status, 0);
                });

            test(
                "Checking whether the generated module can be loaded…",
                () =>
                {
                    doesNotThrow(
                        () =>
                        {
                            createRequire(import.meta.url)(generator.destinationPath());
                        });
                });

            test(
                "Checking whether the mocha-tests can be executed…",
                function()
                {
                    this.timeout(8 * 1000);
                    this.slow(4 * 1000);

                    let result = spawnSync(
                        npmWhich(generator.destinationPath()).sync("mocha"),
                        {
                            cwd: generator.destinationPath()
                        });

                    strictEqual(result.status, 0);
                });
        });
}
