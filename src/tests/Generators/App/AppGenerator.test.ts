import Assert = require("assert");
import { spawnSync } from "child_process";
import { TestContext } from "@manuth/extended-yo-generator-test";
import npmWhich = require("npm-which");
import { TempDirectory } from "temp-filesystem";
import { AppGenerator } from "../../../generators/app/AppGenerator";
import { ProjectType } from "../../../generators/app/ProjectType";
import { AppGeneratorSettingKey } from "../../../generators/app/Settings/AppGeneratorSettingKey";

/**
 * Registers tests for the generators.
 *
 * @param context
 * The test-context.
 */
export function AppGeneratorTests(context: TestContext<AppGenerator>): void
{
    suite(
        "AppGenerator",
        () =>
        {
            let tempDir: TempDirectory;

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
                "Checking whether the generator can be executed…",
                async function()
                {
                    this.timeout(0);
                    this.slow(1.5 * 60 * 1000);
                    await Assert.doesNotReject(async () => context.ExecuteGenerator().inDir(tempDir.FullName).toPromise());
                });

            test(
                "Checking whether modules can be generated…",
                async function()
                {
                    this.timeout(0);
                    this.slow(3 * 60 * 1000);

                    await Assert.doesNotReject(
                        () =>
                        {
                            return context.ExecuteGenerator().withPrompts(
                                {
                                    [AppGeneratorSettingKey.ProjectType]: ProjectType.Module
                                }).inDir(tempDir.FullName).toPromise();
                        });

                    spawnSync(
                        npmWhich(__dirname).sync("npm"),
                        [
                            "install",
                            "--silent"
                        ],
                        {
                            cwd: tempDir.FullName
                        });

                    spawnSync(
                        npmWhich(__dirname).sync("npm"),
                        [
                            "run",
                            "build"
                        ],
                        {
                            cwd: tempDir.FullName
                        });

                    Assert.doesNotThrow(
                        () =>
                        {
                            require(tempDir.FullName);
                        });
                });

            test(
                "Checking whether generators can be generated…",
                async function()
                {
                    this.timeout(0);
                    this.slow(5 * 60 * 1000);
                    let subGeneratorDir = new TempDirectory();

                    await Assert.doesNotReject(
                        async () =>
                        {
                            return context.ExecuteGenerator().withPrompts(
                                {
                                    [AppGeneratorSettingKey.ProjectType]: ProjectType.Generator
                                }).inDir(tempDir.FullName).toPromise();
                        });

                    spawnSync(
                        npmWhich(__dirname).sync("npm"),
                        [
                            "install",
                            "--silent"
                        ],
                        {
                            cwd: tempDir.FullName
                        });

                    spawnSync(
                        npmWhich(__dirname).sync("npm"),
                        [
                            "run",
                            "build"
                        ],
                        {
                            cwd: tempDir.FullName
                        });

                    await Assert.doesNotReject(
                        async () =>
                        {
                            return new TestContext(
                                tempDir.MakePath("lib", "generators", "app")).ExecuteGenerator().inDir(
                                    subGeneratorDir.FullName).toPromise();
                        });

                    subGeneratorDir.Dispose();
                });
        });
}
