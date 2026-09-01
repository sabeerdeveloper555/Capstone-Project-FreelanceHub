import mongoose from 'mongoose';
import { Project, Client } from '../models/index.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const ALLOWED_STATUSES = ['Planning', 'In Progress', 'Review', 'Completed', 'On Hold'];

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (Freelancer only)
export const createProject = asyncHandler(async (req, res) => {
  const { title, description, client, budget, deadline, status } = req.body;

  // Validate title
  if (!title || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Project title is required'
    });
  }

  // Validate client ID format
  if (!client) {
    return res.status(400).json({
      success: false,
      message: 'Client ID is required'
    });
  }

  if (!mongoose.Types.ObjectId.isValid(client)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid client ID format'
    });
  }

  // Validate budget
  if (budget === undefined || budget === null || typeof Number(budget) !== 'number' || isNaN(Number(budget)) || Number(budget) < 0) {
    return res.status(400).json({
      success: false,
      message: 'Budget is required and must be a non-negative number'
    });
  }

  // Validate deadline
  if (!deadline || isNaN(Date.parse(deadline))) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid deadline date'
    });
  }

  // Validate status if provided
  const projectStatus = status || 'Planning';
  if (!ALLOWED_STATUSES.includes(projectStatus)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Allowed values: ${ALLOWED_STATUSES.join(', ')}`
    });
  }

  // Validate client existence and client ownership
  const clientDoc = await Client.findById(client);

  if (!clientDoc) {
    return res.status(404).json({
      success: false,
      message: 'Client not found'
    });
  }

  if (clientDoc.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to create a project for this client'
    });
  }

  // Create project with owner set to authenticated user
  const project = await Project.create({
    title: title.trim(),
    description: description ? description.trim() : '',
    client,
    budget: Number(budget),
    deadline: new Date(deadline),
    status: projectStatus,
    owner: req.user._id
  });

  const populatedProject = await Project.findById(project._id)
    .populate('client', 'name email company phone country');

  res.status(201).json({
    success: true,
    message: 'Project created successfully',
    project: populatedProject
  });
});

// @desc    Get all projects for the logged-in freelancer
// @route   GET /api/projects
// @access  Private (Freelancer only)
export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ owner: req.user._id })
    .populate('client', 'name email company phone country')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: projects.length,
    projects
  });
});

// @desc    Get a single project by ID (ownership protected)
// @route   GET /api/projects/:id
// @access  Private (Freelancer only)
export const getProject = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid project ID format'
    });
  }

  const project = await Project.findById(id)
    .populate('client', 'name email company phone country');

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }

  // Verify project ownership
  if (project.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this project'
    });
  }

  res.status(200).json({
    success: true,
    project
  });
});

// @desc    Update a project by ID (ownership protected)
// @route   PUT /api/projects/:id
// @access  Private (Freelancer only)
export const updateProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, client, budget, deadline, status } = req.body;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid project ID format'
    });
  }

  const project = await Project.findById(id);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }

  // Verify project ownership
  if (project.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this project'
    });
  }

  // If client is being updated, validate client ID, existence, and ownership
  if (client !== undefined) {
    if (!mongoose.Types.ObjectId.isValid(client)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid client ID format'
      });
    }

    const newClientDoc = await Client.findById(client);

    if (!newClientDoc) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    if (newClientDoc.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to assign project to this client'
      });
    }

    project.client = client;
  }

  // Validate & update title if provided
  if (title !== undefined) {
    if (!title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Project title cannot be empty'
      });
    }
    project.title = title.trim();
  }

  // Update description if provided
  if (description !== undefined) {
    project.description = description.trim();
  }

  // Validate & update budget if provided
  if (budget !== undefined) {
    if (typeof Number(budget) !== 'number' || isNaN(Number(budget)) || Number(budget) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Budget must be a non-negative number'
      });
    }
    project.budget = Number(budget);
  }

  // Validate & update deadline if provided
  if (deadline !== undefined) {
    if (isNaN(Date.parse(deadline))) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid deadline date'
      });
    }
    project.deadline = new Date(deadline);
  }

  // Validate & update status if provided
  if (status !== undefined) {
    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${ALLOWED_STATUSES.join(', ')}`
      });
    }
    project.status = status;
  }

  await project.save();

  const updatedProject = await Project.findById(project._id)
    .populate('client', 'name email company phone country');

  res.status(200).json({
    success: true,
    message: 'Project updated successfully',
    project: updatedProject
  });
});

// @desc    Delete a project by ID (ownership protected)
// @route   DELETE /api/projects/:id
// @access  Private (Freelancer only)
export const deleteProject = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid project ID format'
    });
  }

  const project = await Project.findById(id);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }

  // Verify project ownership
  if (project.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this project'
    });
  }

  await project.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Project deleted successfully'
  });
});
