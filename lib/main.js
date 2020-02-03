"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const getChangedFiles_1 = require("./getChangedFiles");
const github = __importStar(require("@actions/github"));
const getCodeOwnersFromPaths_1 = require("./getCodeOwnersFromPaths");
const getLabelsFromOwners_1 = require("./getLabelsFromOwners");
const applyLabels_1 = require("./applyLabels");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = new github.GitHub(core.getInput('githubToken'));
            // get all paths (file paths) changed in the PR
            const paths = yield getChangedFiles_1.getChangedFiles(github.context, client);
            core.info(`Obtained paths: ${paths}`);
            // paths -> set of codeowners for the paths
            const owners = yield getCodeOwnersFromPaths_1.getCodeOwnersFromPaths(paths);
            core.info(`Obtained owners for paths: ${owners}`);
            // set of codeowners -> set of labels
            const labels = yield getLabelsFromOwners_1.getLabelsFromOwners(owners);
            core.info(`Obtained labels for change: ${labels}`);
            // apply the set of labels to the PR
            yield applyLabels_1.applyLabels(github.context, client, labels);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
