import { spawnSync } from "child_process";
import GitBranch = require("git-branch");
import npmWhich = require("npm-which");

(
    async () =>
    {
        let branchName = await GitBranch(__dirname);
        let releaseName = branchName.replace(/^release\/(.*)/, "$1");

        if (releaseName.length > 0)
        {
            spawnSync(
                npmWhich(__dirname).sync("lerna"),
                [
                    "version",
                    releaseName,
                    "-y"
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
