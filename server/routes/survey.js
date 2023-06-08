"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const survey_1 = require("../controllers/survey");
const router = express_1.default.Router();
router.get('/manage', survey_1.DisplaySurveyManagePage);
router.get('/active', survey_1.DisplaySurveyActivePage);
router.get('/manage/:id', survey_1.DisplaySurveyEditPage);
router.post('/manage/:id', survey_1.ProcessSurveyEditPage);
router.get('/add', survey_1.DisplaySurveyAddPage);
router.post('/add', survey_1.ProcessSurveyAddPage);
router.get('/delete/:id', survey_1.ProcessSurveyDeletePage);
router.get('/take/:id', survey_1.DisplayTakeSurvey);
router.post('/take/:id', survey_1.ProcessTakeSurvey);
router.get('/take/:id/question/:qid', survey_1.AnswerQuestion);
router.post('/take/:id/question/:qid', survey_1.ProcessQuestion);
router.get('/take/:id/question/:qid/:oid', survey_1.OptionSelect);
router.get('/result/:id', survey_1.DisplaySurveyResultPage);
router.get('/manage/:id/question/add', survey_1.DisplayQuestionAddPage);
router.post('/manage/:id/question/add', survey_1.ProcessQuestionAddPage);
router.get('/manage/:id/question/edit/:qid', survey_1.DisplayQuestionEditPage);
router.post('/manage/:id/question/edit/:qid', survey_1.ProcessQuestionEditPage);
router.get('/manage/:id/question/delete/:qid', survey_1.ProcessQuestionDeletePage);
exports.default = router;
//# sourceMappingURL=survey.js.map