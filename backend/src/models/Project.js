import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: [true, 'Client reference is required'],
      index: true
    },
    budget: {
      type: Number,
      required: [true, 'Budget is required'],
      min: [0, 'Budget must be a non-negative number']
    },
    deadline: {
      type: Date,
      required: [true, 'Project deadline is required']
    },
    status: {
      type: String,
      required: [true, 'Project status is required'],
      enum: {
        values: ['Planning', 'In Progress', 'Review', 'Completed', 'On Hold'],
        message: '{VALUE} is not a valid status'
      },
      default: 'Planning'
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner reference is required'],
      index: true
    }
  },
  {
    timestamps: true
  }
);

const Project = mongoose.model('Project', projectSchema);

export default Project;
