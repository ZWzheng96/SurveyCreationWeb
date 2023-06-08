import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const questionSchema = new Schema({
      question: String,
      options: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Option' }],
},
{
      collection: "intheLoopQuestions"
});

const Model = mongoose.model("Question", questionSchema)

export default Model