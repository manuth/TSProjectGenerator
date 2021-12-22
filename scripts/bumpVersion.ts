import { spawnSync } from "child_process";
import { dirname, join } from "path";
import { Dictionary, Package } from "@manuth/package-json-editor";
import { pathExists } from "fs-extra";
import GitBranch = require("git-branch");
import { glob } from "glob";
import npmWhich = require("npm-which");

(
    async () =>
    {
        let npmPackage = new Package(join(__dirname, "..", Package.FileName));
        let workspacePaths: string[];
        let workspacePackages: Package[] = [];
        let branchName = await GitBranch(__dirname);
        let releaseName = branchName.replace(/^release\/(.*)/, "$1");

        if (releaseName.length > 0)
        {
            spawnSync(
                npmWhich(__dirname).sync("npm"),
                [
                    "--no-git-tag-version",
                    "version",
                    "--workspaces",
                    releaseName,
                    "--allow-same-version"
                ]);

            let workspaceSetting: any = npmPackage.AdditionalProperties.Get("workspaces");

            if (Array.isArray(workspaceSetting))
            {
                workspacePaths = workspaceSetting;
            }
            else
            {
                workspacePaths = workspaceSetting?.packages;
            }

            for (let pattern of workspacePaths ?? [])
            {
                for (let workspacePath of glob.sync(pattern, { cwd: dirname(npmPackage.FileName) }))
                {
                    let packageFileName = join(workspacePath, Package.FileName);

                    if (await pathExists(packageFileName))
                    {
                        workspacePackages.push(new Package(packageFileName));
                    }
                }
            }

            for (let workspacePackage of workspacePackages)
            {
                for (let dependencyCandidate of workspacePackages)
                {
                    if (dependencyCandidate.Name !== workspacePackage.Name)
                    {
                        for (let entry of [
                            [workspacePackage.Dependencies, "--save"],
                            [workspacePackage.DevelopmentDependencies, "--save-dev"],
                            [workspacePackage.OptionalDependencies, "--save-optional"],
                            [workspacePackage.PeerDependencies, "--save-peer"]
                        ] as Array<[Dictionary<string, string>, string]>)
                        {
                            if (entry[0].Has(dependencyCandidate.Name))
                            {
                                spawnSync(
                                    npmWhich(__dirname).sync("npm"),
                                    [
                                        "install",
                                        "--ignore-scripts",
                                        "--no-audit",
                                        "--workspace",
                                        workspacePackage.Name,
                                        entry[1],
                                        dependencyCandidate.Name
                                    ]);
                            }
                        }
                    }
                }
            }

            spawnSync(
                npmWhich(__dirname).sync("npm"),
                [
                    "install",
                    "--ignore-scripts"
                ]);

            spawnSync(
                npmWhich(__dirname).sync("git"),
                [
                    "commit",
                    "-a",
                    "-m",
                    `Bump the version number to ${releaseName}`
                ]);
        }
        else
        {
            console.error(`This method is not allowed on the current branch \`${branchName}\``);
        }
    })();
