import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const surveySchema = new Schema({
      
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    remarks: String,
    date: Date,
    active: Boolean,
    questions: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Question'} ]
},
{
    collection: "intheLoopSurveys"
});

const Model = mongoose.model("Survey", surveySchema)

export default Model