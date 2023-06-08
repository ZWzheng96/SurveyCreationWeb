import express from 'express';
import { DisplaySurveyAddPage, DisplaySurveyEditPage, 
         DisplaySurveyManagePage, DisplaySurveyActivePage, 
         ProcessSurveyAddPage, ProcessSurveyDeletePage, ProcessSurveyEditPage, 
         DisplayQuestionAddPage, ProcessQuestionAddPage, ProcessQuestionDeletePage, 
         DisplayTakeSurvey, ProcessTakeSurvey, DisplaySurveyResultPage, DisplayQuestionEditPage, ProcessQuestionEditPage,
         AnswerQuestion, ProcessQuestion, OptionSelect
        
        } from '../controllers/survey';
                  
const router = express.Router();

// Survey-list : DISPLAY 
router.get('/manage', DisplaySurveyManagePage);

// Survey-active : DISPLAY 
router.get('/active', DisplaySurveyActivePage);

// Survey-edit : DISPLAY
router.get('/manage/:id', DisplaySurveyEditPage);

// Survey-edit : PROCESS
router.post('/manage/:id', ProcessSurveyEditPage);
  
// Survey-edit : Create - DISPLAY
router.get('/add', DisplaySurveyAddPage);

// Survey-edit : Create - PROCESS 
router.post('/add', ProcessSurveyAddPage);

// Survey-edit : Delete - PROCESS 
router.get('/delete/:id', ProcessSurveyDeletePage);

/* =========================================================================== */
/*  Take Survey 
/* =========================================================================== */

router.get('/take/:id', DisplayTakeSurvey);

router.post('/take/:id', ProcessTakeSurvey);

router.get('/take/:id/question/:qid', AnswerQuestion);

router.post('/take/:id/question/:qid', ProcessQuestion);

router.get('/take/:id/question/:qid/:oid', OptionSelect);


/* =========================================================================== */
/*  See Results
/* =========================================================================== */

router.get('/result/:id', DisplaySurveyResultPage);



/* =========================================================================== */
/*  Questions 
/* =========================================================================== */

// Survey Add Questions: DISPLAY
router.get('/manage/:id/question/add', DisplayQuestionAddPage);

// Survey Add Questions: PROCESS
router.post('/manage/:id/question/add', ProcessQuestionAddPage);

// Survey Modify Questions: DISPLAY

router.get('/manage/:id/question/edit/:qid', DisplayQuestionEditPage);

// Survey Modify Questions: PROCESS

router.post('/manage/:id/question/edit/:qid', ProcessQuestionEditPage);

// Survey Questions: Delete 
router.get('/manage/:id/question/delete/:qid', ProcessQuestionDeletePage)

export default router;

