const mongoose = require('mongoose');
const { Schema } = mongoose;

const launchSchema = new Schema({
    userid : {type:mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    command: { type: String, required: true },
    apps: { type: [String], default: [] },
    websites: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Launch', launchSchema);
