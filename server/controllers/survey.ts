import express from 'express';
import surveyModel from '../models/survey';
import questionModel from '../models/question'; 
import optionModel from '../models/option';
import { UserDisplayName } from '../utils';
import { findSourceMap } from 'module';
import { Mongoose } from 'mongoose';
import { RequestHeaderFieldsTooLarge } from 'http-errors';
import { brotliDecompressSync } from 'zlib';

// ===========================
//  Manage Survey List : DISPLAY 
// ===========================
export function DisplaySurveyManagePage(req: express.Request, res: express.Response, next: express.NextFunction) {
    surveyModel.find(
        { user: req.user },
        function (err, intheLoopSurveys) {
            if (err) {
                console.error(err);
                res.end(err);
            }
            res.render('index-sub', { title: 'Manage Your Surveys', page: 'survey/survey-manage', surveyList: intheLoopSurveys, displayName: UserDisplayName(req) })
        }
    ).sort('date');
};

// ===========================
//   Active Survey List : DISPLAY 
// ===========================
export function DisplaySurveyActivePage(req: express.Request, res: express.Response, next: express.NextFunction) {

    surveyModel.find({ active: true }).
                populate('user').
                populate('questions').sort('date').exec( function (err, surveyItem) { 
        if (err) {
            console.error(err);
            res.end(err);
        }
        res.render('index-sub', { title: 'Active Surveys', page: 'survey/survey-active', surveyList: surveyItem, displayName: UserDisplayName(req) })
    })
};

// ===========================
//   Edit Survey : DISPLAY
// ===========================  
export function DisplaySurveyEditPage(req: express.Request, res: express.Response, next: express.NextFunction) {
    let id = req.params.id;
    
    surveyModel.findById({ _id: id}).populate('questions').exec( function (err, surveyItem) { 
        if (err) {
            console.error(err);
            res.end(err);
        }
        res.render('index-sub', { title: "Manage Your Survey", page: "survey/survey-edit", item: surveyItem, displayName: UserDisplayName(req) })
    })
}    

// ===========================
//   Edit Survey : PROCESS
// ===========================
export function ProcessSurveyEditPage(req: express.Request, res: express.Response, next: express.NextFunction) {
    
    let id = req.params.id
    let activeStatus = req.body.isActive
    let isActive = false;

    if (activeStatus == "active") {
        isActive = true;
    }

    let title = req.body.title
    let remarks = req.body.remarks

    surveyModel.updateOne({ _id: id }, {title: title, remarks: remarks, active: isActive}, {}, (err) => {
        if (err) {
            console.error(err);
            res.end(err);
        }
        res.redirect('/survey/manage');
    })
}

// ====================================
//   Create Survey : DISPLAY
// ====================================
export function DisplaySurveyAddPage(req: express.Request, res: express.Response, next: express.NextFunction) {
    res.render('index-sub', { title: 'Create Survey', page: 'survey/survey-create', item: '', displayName: UserDisplayName(req) });
}

// ====================================
//   Create Survey : PROCESS 
// ====================================
export function ProcessSurveyAddPage(req: express.Request, res: express.Response, next: express.NextFunction): void {

    let newSurvey = new surveyModel({
        "user": req.user,
        "title": req.body.title,
        "remarks": req.body.remarks,
        "date": new Date(),
        "active": false,
        
    });

    let id = newSurvey._id;

    surveyModel.create(newSurvey, (err: any) => {
        if (err) {
            console.error(err);
            res.end(err);
        };
        res.redirect('/survey/manage/' + id);
    });
}

// ====================================
//   Delete Survey - PROCESS 
// ====================================
export function ProcessSurveyDeletePage(req: express.Request, res: express.Response, next: express.NextFunction) {
    let id = req.params.id;
    surveyModel.remove({ _id: id }, (err) => {
        if (err) {
            console.error(err);
            res.end(err);
        };
        res.redirect('/survey/manage');
    })
}


// ====================================
//   Question: ADD - Display 
// ====================================
export function DisplayQuestionAddPage(req: express.Request, res: express.Response, next: express.NextFunction) {
    let id = req.params.id
    let qid = req.params.qid

    surveyModel.findOne({ _id: id }, {}, {}, (err, surveyItem) => {
        if (err) {
            console.error(err);
            res.end(err);
        }
        let values = ["","","","",""];
        res.render('index-sub', { values: values, title: "Add Survey Questions", page: "survey/survey-question-edit", item: surveyItem, displayName: UserDisplayName(req) })
    })
}

// ====================================
//   Question: ADD - Process 
// ====================================
export function ProcessQuestionAddPage(req: express.Request, res: express.Response, next: express.NextFunction) {
    let id = req.params.id;
    let qid = req.params.qid;

    // Create Question 
    let fields = ["option1", "option2", "option3", "option4", "option5"];
    let questionText = req.body.question;
    let options = [];

    for (let i = 0; i < fields.length; i++) {
        let optionText = req.body[fields[i]];
        if (optionText != "") {
            let option = new optionModel({"optionText": optionText, "answerCount": 0});
            options.push(option);

            optionModel.create(option, (err:any) => {
                if (err) { 
                    console.error(err);
                    res.end(err);
                };
            })
        }
    }
    let newQuestion = new questionModel({
        "question": questionText,
        "options": options
    });

    questionModel.create(newQuestion, (err: any) => {
        if (err) {
            console.error(err);
            res.end(err);
        };
    });

    console.log(newQuestion);

    surveyModel.updateOne({ _id: id }, { $push: { questions: newQuestion }}, {}, (err) => {
        if (err) {
            console.error(err);
            res.end(err);
        };
        res.redirect('/survey/manage/' + id);
    })
}

// ====================================
//   Question: MODIFY - Display 
// ====================================

export function DisplayQuestionEditPage(req: express.Request, res: express.Response, next: express.NextFunction) {
    let id = req.params.id;
    let qid = req.params.qid;

    questionModel.findById({ _id: qid }).populate('options').exec(function (err, questionItem) {
        if (err) {
            console.error(err);
            res.end(err);
        }
        console.log(questionItem);
        let values = ["","","","",""];

        res.render('index-sub',
            {
                values: values,
                title: "Modify Survey Questions", page: "survey/survey-question-edit", item: questionItem,
                displayName: UserDisplayName(req),
            })
    })
}

// ====================================
//   Question: MODIFY - Process 
// ====================================

export function ProcessQuestionEditPage(req: express.Request, res: express.Response, next: express.NextFunction) {
    let id = req.params.id;
    res.redirect('/survey/manage/' + id);
}
let values = ["","","","",""];

// ====================================
//   Question: DELETE - Process 
// ====================================

export function ProcessQuestionDeletePage(req: express.Request, res: express.Response, next: express.NextFunction){
    let id = req.params.id;
    let qid = req.params.qid;

    surveyModel.updateOne({ _id: id }, { $pullAll: { questions: [{ _id: qid }]}}, {}, (err) => {
        if (err) {
            console.error(err);
            res.end(err);
        };
        res.redirect('/survey/manage/' + id);
    })

    questionModel.deleteOne({ _id: qid }, (err) => {
        if (err) {
            console.error(err);
            res.end(err);
        };
    })
    console.log(qid);
}

// ====================================
//   Take Survey: - DISPLAY 
// ====================================

export function DisplayTakeSurvey(req: express.Request, res: express.Response, next: express.NextFunction){
    let id = req.params.id
    surveyModel.findById({ _id: id}).populate('questions').
    // Element Populate
    populate({ 
        path: 'questions',
        populate: {
          path: 'options',
          model: 'Option'
        } 
     }).
    exec( function (err, surveyItem) { 
        if (err) {
            console.error(err);
            res.end(err);
        }
        console.log(surveyItem);

        res.render('index-sub', { title: surveyItem.title, page: "survey/survey-take", item: surveyItem, questions: surveyItem.questions, displayName: UserDisplayName(req) })
    })
}

// ====================================
//   Take Survey: - Process 
// ====================================

export function ProcessTakeSurvey(req: express.Request, res: express.Response, next: express.NextFunction){
    res.redirect('/survey/active');
}


// ====================================
//   Answer Question: - Display 
// ====================================
export function AnswerQuestion(req: express.Request, res: express.Response, next: express.NextFunction) {
    let id = req.params.id
    let qid = req.params.qid

    questionModel.findById({ _id: qid}).populate('options').
    exec( function (err, item) { 
        if (err) {
            console.error(err);
            res.end(err);
        }
        res.render('index-sub', { values: values, title: "Add Survey Questions", page: "survey/answer-question", surveyid: id, item: item, displayName: UserDisplayName(req) })
    })
}

// ====================================
//   Answer Question: - Process 
// ====================================

export function ProcessQuestion(req: express.Request, res: express.Response, next: express.NextFunction) {

    let id = req.params.id;
    let qid = req.params.qid;
    let answer = req.body.answer;

    questionModel.updateOne({_id:qid}).$where

}

// ====================================
//   Select Option
// ====================================
export function OptionSelect(req: express.Request, res: express.Response, next: express.NextFunction) {
    let id = req.params.id;
    let qid = req.params.qid;
    let oid = req.params.oid;

    optionModel.findOneAndUpdate({_id : oid}, {$inc : { 'answerCount' : 1 }}).exec( function (err, item) { 
        if (err) {
            console.error(err);
            res.end(err);
        }
        res.redirect('/survey/take/' + id);
    });
}


// ====================================
//   Show Survey Result: - Display 
// ====================================

export function DisplaySurveyResultPage(req: express.Request, res: express.Response, next: express.NextFunction) {
    let id = req.params.id
    surveyModel.findById({ _id: id}).populate('questions').
    // Element Populate
    populate({ 
        path: 'questions',
        populate: {
          path: 'options',
          model: 'Option'
        } 
     }).
    exec( function (err, surveyItem) { 
        if (err) {
            console.error(err);
            res.end(err);
        }
        console.log(surveyItem);


        res.render('index-sub', { title: surveyItem.title, page: "survey/survey-result", item: surveyItem, questions: surveyItem.questions, displayName: UserDisplayName(req) })
    })
}