// import mongoose from 'mongoose'

// const challenge = mongoose.Schema({
//     id_number: {
//         type: Number,
//         required: true,
//         unique: true
//     },
//     function_name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     testcase: {
//         type: mongoose.Schema.Types.Mixed,
//         required: true
//     },
//     expected: {
//         type: mongoose.Schema.Types.Mixed, // can be number, string, boolean, array
//         required: true
//     },
//     problem_statement: {
//         type: String,
//         required: true,
//         trim: true
//     }
// })
// export default challenge;


import mongoose from 'mongoose';

const challenge = mongoose.Schema({
  id_number: {
    type: Number,
    required: true,
    unique: true
  },
  function_name: {
    type: String,
    required: true,
    trim: true
  },
  testcase: {
    type: Map, // can hold key-value pairs like {0: {...}, 1: {...}}
    of: new mongoose.Schema({
      case: {
        type: Array, // your [3,3], [2,8] inputs
        required: true
      },
      expected: {
        type: mongoose.Schema.Types.Mixed, // can be number, string, boolean, array, etc.
        required: true
      }
    }),
    required: true
  },
  problem_statement: {
    type: String,
    required: true,
    trim: true
  }
});

export default challenge;
