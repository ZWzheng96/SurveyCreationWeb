  import mongoose from 'mongoose';
  const Schema = mongoose.Schema;
  
  const surveyOptionSchema = new Schema({    
      optionText: String,  
      answerCount: Number
  },
  {
      collection: "intheLoopOptions"
  });
  
  const Model = mongoose.model("Option", surveyOptionSchema)
  
  export default Model