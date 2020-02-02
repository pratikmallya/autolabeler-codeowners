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
Object.defineProperty(exports, "__esModule", { value: true });
function getChangedFiles(context, client) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!['push', 'pull_request'].includes(context.eventName)) {
            throw new Error(`Unexpected event: ${context.eventName}`);
        }
        // Note: the per_page param is set to the max value for a single page (100)
        // TODO: implement pagination to get all files if > 100
        // TODO: use graphql api
        const files = yield client.pulls.listFiles({
            owner: context.issue.owner,
            repo: context.issue.repo,
            // eslint-disable-next-line @typescript-eslint/camelcase
            pull_number: context.issue.number,
            // eslint-disable-next-line @typescript-eslint/camelcase
            per_page: 100
        });
        return files.data.map(x => x['filename']);
    });
}
exports.getChangedFiles = getChangedFiles;
