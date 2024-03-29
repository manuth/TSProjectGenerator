import { doesNotReject, doesNotThrow, strictEqual } from "node:assert";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { PackageType } from "@manuth/package-json-editor";
import npmWhich from "npm-which";
import { packageDirectory } from "pkg-dir";
import RandExp from "randexp";
import { TSModuleGenerator } from "../../../generators/module/TSModuleGenerator.js";
import { TSProjectSettingKey } from "../../../Project/Settings/TSProjectSettingKey.js";
import { TestContext } from "../../TestContext.js";

const { randexp } = RandExp;

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
            let workspaceRoot: string;
            let moduleName: string;
            let generator: TSModuleGenerator;
            context.RegisterWorkingDirRestorer();

            suiteSetup(
                async function()
                {
                    this.timeout(5 * 60 * 1000);
                    let dirName = fileURLToPath(new URL(".", import.meta.url));
                    npmPath = npmWhich(dirName).sync("npm");

                    workspaceRoot = await packageDirectory(
                        {
                            cwd: dirname(
                                await packageDirectory(
                                    {
                                        cwd: dirName
                                    }))
                        });

                    moduleName = randexp(/@ts-module-generator-test\/[a-z]+/);
                    generator = await context.Generator;

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

                    spawnSync(
                        npmPath,
                        [
                            "install",
                            "--no-save",
                            `${moduleName}@file:${generator.destinationPath()}`
                        ],
                        {
                            cwd: workspaceRoot
                        });
                });

            suiteTeardown(
                async function()
                {
                    this.timeout(0.5 * 60 * 1000);

                    spawnSync(
                        npmPath,
                        [
                            "uninstall",
                            "--no-save",
                            moduleName
                        ],
                        {
                            cwd: workspaceRoot
                        });
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
                            cwd: generator.destinationPath(),
                            stdio: "ignore"
                        });

                    let buildResult = spawnSync(
                        npmPath,
                        [
                            "run",
                            "build"
                        ],
                        {
                            cwd: generator.destinationPath(),
                            stdio: "ignore"
                        });

                    strictEqual(installationResult.status, 0);
                    strictEqual(buildResult.status, 0);
                });

            test(
                "Checking whether the generated module can be imported…",
                async () =>
                {
                    await doesNotReject(() => import(moduleName));
                });

            test(
                `Checking whether \`${nameof(PackageType.CommonJS)}\` modules can be generated…`,
                async function()
                {
                    this.timeout(6 * 60 * 1000);
                    this.slow(3 * 60 * 1000);

                    let runContext = context.ExecuteGenerator().withPrompts(
                        {
                            [TSProjectSettingKey.ESModule]: false
                        });

                    await runContext.toPromise();
                    let generator = runContext.generator;

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

                    doesNotThrow(() => createRequire(import.meta.url)(generator.destinationPath()));
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
                            cwd: generator.destinationPath(),
                            stdio: "ignore"
                        });

                    strictEqual(result.status, 0);
                });
        });
}
