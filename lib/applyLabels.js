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
function applyLabels(context, client, labels) {
    return __awaiter(this, void 0, void 0, function* () {
        // create labels if they don't exist
        const p = [];
        // store labels in a list; will be used later
        const labelsAll = [];
        try {
            for (const label of labels) {
                labelsAll.push(label.name);
                p.push(client.issues.createLabel({
                    owner: context.issue.owner,
                    repo: context.issue.repo,
                    name: label.name,
                    color: label.color
                }));
            }
            yield Promise.all(p);
        }
        catch (error) {
            // if 422, label already exists
            if (error.status !== 422) {
                throw error;
            }
        }
        // apply labels to the PR
        // don't even try if no labels
        if (labelsAll.length === 0) {
            return;
        }
        yield client.issues.addLabels({
            owner: context.issue.owner,
            repo: context.issue.repo,
            // eslint-disable-next-line @typescript-eslint/camelcase
            issue_number: context.issue.number,
            labels: labelsAll
        });
    });
}
exports.applyLabels = applyLabels;
