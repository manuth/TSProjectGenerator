import { applyPatch, parsePatch } from "diff";
import { readFile } from "fs-extra";
import { obj } from "through2";
import Vinyl = require("vinyl");

export = (patchPath: string): NodeJS.ReadWriteStream =>
{
    return obj(
        async (vinylFile: Vinyl, encoding, callback) =>
        {
            if (vinylFile.isBuffer())
            {
                let contents = vinylFile.contents.toString(encoding);

                vinylFile.contents = Buffer.from(
                    applyPatch(
                        contents,
                        parsePatch(
                            (await readFile(patchPath)).toString())[0]), encoding);

                callback(null, vinylFile);
            }
            else
            {
                callback(new Error("Only buffers are supported."));
            }
        });
};
