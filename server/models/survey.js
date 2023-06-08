"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const surveySchema = new Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    remarks: String,
    date: Date,
    active: Boolean,
    questions: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Question' }]
}, {
    collection: "intheLoopSurveys"
});
const Model = mongoose_1.default.model("Survey", surveySchema);
exports.default = Model;
//# sourceMappingURL=survey.js.map