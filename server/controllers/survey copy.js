"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisplaySurveyResultPage = exports.ProcessQuestion = exports.AnswerQuestion = exports.ProcessTakeSurvey = exports.DisplayTakeSurvey = exports.ProcessQuestionDeletePage = exports.ProcessQuestionEditPage = exports.DisplayQuestionEditPage = exports.ProcessQuestionAddPage = exports.DisplayQuestionAddPage = exports.ProcessSurveyDeletePage = exports.ProcessSurveyAddPage = exports.DisplaySurveyAddPage = exports.ProcessSurveyEditPage = exports.DisplaySurveyEditPage = exports.DisplaySurveyActivePage = exports.DisplaySurveyManagePage = void 0;
const survey_1 = __importDefault(require("../models/survey"));
const question_1 = __importDefault(require("../models/question"));
const option_1 = __importDefault(require("../models/option"));
const utils_1 = require("../utils");
function DisplaySurveyManagePage(req, res, next) {
    survey_1.default.find({ user: req.user }, function (err, intheLoopSurveys) {
        if (err) {
            console.error(err);
            res.end(err);
        }
        res.render('index-sub', { title: 'Manage Your Surveys', page: 'survey/survey-manage', surveyList: intheLoopSurveys, displayName: (0, utils_1.UserDisplayName)(req) });
    }).sort('date');
}
exports.DisplaySurveyManagePage = DisplaySurveyManagePage;
;
function DisplaySurveyActivePage(req, res, next) {
    survey_1.default.find({ active: true }).
        populate('user').
        populate('questions').sort('date').exec(function (err, surveyItem) {
        if (err) {
            console.error(err);
            res.end(err);
        }
        res.render('index-sub', { title: 'Active Surveys', page: 'survey/survey-active', surveyList: surveyItem, displayName: (0, utils_1.UserDisplayName)(req) });
    });
}
exports.DisplaySurveyActivePage = DisplaySurveyActivePage;
;
function DisplaySurveyEditPage(req, res, next) {
    let id = req.params.id;
    survey_1.default.findById({ _id: id }).populate('questions').exec(function (err, surveyItem) {
        if (err) {
            console.error(err);
            res.end(err);
        }
        res.render('index-sub', { title: "Manage Your Survey", page: "survey/survey-edit", item: surveyItem, displayName: (0, utils_1.UserDisplayName)(req) });
    });
}
exports.DisplaySurveyEditPage = DisplaySurveyEditPage;
function ProcessSurveyEditPage(req, res, next) {
    let id = req.params.id;
    let activeStatus = req.body.isActive;
    let isActive = false;
    if (activeStatus == "active") {
        isActive = true;
    }
    let title = req.body.title;
    let remarks = req.body.remarks;
    survey_1.default.updateOne({ _id: id }, { title: title, remarks: remarks, active: isActive }, {}, (err) => {
        if (err) {
            console.error(err);
            res.end(err);
        }
        res.redirect('/survey/manage');
    });
}
exports.ProcessSurveyEditPage = ProcessSurveyEditPage;
function DisplaySurveyAddPage(req, res, next) {
    res.render('index-sub', { title: 'Create Survey', page: 'survey/survey-create', item: '', displayName: (0, utils_1.UserDisplayName)(req) });
}
exports.DisplaySurveyAddPage = DisplaySurveyAddPage;
function ProcessSurveyAddPage(req, res, next) {
    let newSurvey = new survey_1.default({
        "user": req.user,
        "title": req.body.title,
        "remarks": req.body.remarks,
        "date": new Date(),
        "active": false,
    });
    let id = newSurvey._id;
    survey_1.default.create(newSurvey, (err) => {
        if (err) {
            console.error(err);
            res.end(err);
        }
        ;
        res.redirect('/survey/manage/' + id);
    });
}
exports.ProcessSurveyAddPage = ProcessSurveyAddPage;
function ProcessSurveyDeletePage(req, res, next) {
    let id = req.params.id;
    survey_1.default.remove({ _id: id }, (err) => {
        if (err) {
            console.error(err);
            res.end(err);
        }
        ;
        res.redirect('/survey/manage');
    });
}
exports.ProcessSurveyDeletePage = ProcessSurveyDeletePage;
function DisplayQuestionAddPage(req, res, next) {
    let id = req.params.id;
    let qid = req.params.qid;
    survey_1.default.findOne({ _id: id }, {}, {}, (err, surveyItem) => {
        if (err) {
            console.error(err);
            res.end(err);
        }
        let values = ["", "", "", "", ""];
        res.render('index-sub', { values: values, title: "Add Survey Questions", page: "survey/survey-question-edit", item: surveyItem, displayName: (0, utils_1.UserDisplayName)(req) });
    });
}
exports.DisplayQuestionAddPage = DisplayQuestionAddPage;
function ProcessQuestionAddPage(req, res, next) {
    let id = req.params.id;
    let qid = req.params.qid;
    let fields = ["option1", "option2", "option3", "option4", "option5"];
    let questionText = req.body.question;
    let options = [];
    for (let i = 0; i < fields.length; i++) {
        let optionText = req.body[fields[i]];
        if (optionText != "") {
            let option = new option_1.default({ "optionText": optionText, "answerCount": 0 });
            options.push(option);
            option_1.default.create(option, (err) => {
                if (err) {
                    console.error(err);
                    res.end(err);
                }
                ;
            });
        }
    }
    let newQuestion = new question_1.default({
        "question": questionText,
        "options": options
    });
    question_1.default.create(newQuestion, (err) => {
        if (err) {
            console.error(err);
            res.end(err);
        }
        ;
    });
    console.log(newQuestion);
    survey_1.default.updateOne({ _id: id }, { $push: { questions: newQuestion } }, {}, (err) => {
        if (err) {
            console.error(err);
            res.end(err);
        }
        ;
        res.redirect('/survey/manage/' + id);
    });
}
exports.ProcessQuestionAddPage = ProcessQuestionAddPage;
function DisplayQuestionEditPage(req, res, next) {
    let id = req.params.id;
    let qid = req.params.qid;
    question_1.default.findById({ _id: qid }).populate('options').exec(function (err, questionItem) {
        if (err) {
            console.error(err);
            res.end(err);
        }
        console.log(questionItem);
        let values = ["", "", "", "", ""];
        res.render('index-sub', {
            values: values,
            title: "Modify Survey Questions", page: "survey/survey-question-edit", item: questionItem,
            displayName: (0, utils_1.UserDisplayName)(req),
        });
    });
}
exports.DisplayQuestionEditPage = DisplayQuestionEditPage;
function ProcessQuestionEditPage(req, res, next) {
    let id = req.params.id;
    res.redirect('/survey/manage/' + id);
}
exports.ProcessQuestionEditPage = ProcessQuestionEditPage;
let values = ["", "", "", "", ""];
function ProcessQuestionDeletePage(req, res, next) {
    let id = req.params.id;
    let qid = req.params.qid;
    survey_1.default.updateOne({ _id: id }, { $pullAll: { questions: [{ _id: qid }] } }, {}, (err) => {
        if (err) {
            console.error(err);
            res.end(err);
        }
        ;
        res.redirect('/survey/manage/' + id);
    });
    question_1.default.deleteOne({ _id: qid }, (err) => {
        if (err) {
            console.error(err);
            res.end(err);
        }
        ;
    });
    console.log(qid);
}
exports.ProcessQuestionDeletePage = ProcessQuestionDeletePage;
function DisplayTakeSurvey(req, res, next) {
    let id = req.params.id;
    survey_1.default.findById({ _id: id }).populate('questions').
        populate({
        path: 'questions',
        populate: {
            path: 'options',
            model: 'Option'
        }
    }).
        exec(function (err, surveyItem) {
        if (err) {
            console.error(err);
            res.end(err);
        }
        console.log(surveyItem);
        res.render('index-sub', { title: surveyItem.title, page: "survey/survey-take", item: surveyItem, questions: surveyItem.questions, displayName: (0, utils_1.UserDisplayName)(req) });
    });
}
exports.DisplayTakeSurvey = DisplayTakeSurvey;
function ProcessTakeSurvey(req, res, next) {
    let id = req.params.id;
    let answer = req.body.q0o0;
    console.log(answer);
}
exports.ProcessTakeSurvey = ProcessTakeSurvey;
function AnswerQuestion(req, res, next) {
    console.log();
}
exports.AnswerQuestion = AnswerQuestion;
function ProcessQuestion(req, res, next) {
    console.log();
}
exports.ProcessQuestion = ProcessQuestion;
function DisplaySurveyResultPage(req, res, next) {
    res.render('index-sub', { title: "", page: "survey/survey-result", item: "", displayName: (0, utils_1.UserDisplayName)(req) });
}
exports.DisplaySurveyResultPage = DisplaySurveyResultPage;
//# sourceMappingURL=survey%20copy.js.map