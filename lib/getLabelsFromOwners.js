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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const randomcolor_1 = __importDefault(require("randomcolor"));
function getLabelsFromOwners(owners) {
    return __awaiter(this, void 0, void 0, function* () {
        const labels = new Set([]);
        for (const owner of owners) {
            labels.add({
                name: `${owner}`,
                // From the documentation: https://octokit.github.io/rest.js/#octokit-routes-issues-create-label
                // > The hexadecimal color code for the label, without the leading #
                // randomcolor() returns a color code with a '#' prefix, so we remove it
                color: randomcolor_1.default().substr(1)
            });
        }
        return labels;
    });
}
exports.getLabelsFromOwners = getLabelsFromOwners;
