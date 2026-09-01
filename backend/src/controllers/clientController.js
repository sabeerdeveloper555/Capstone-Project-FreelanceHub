import mongoose from 'mongoose';
import { Client } from '../models/index.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

// Simple email regex validator
const isValidEmail = (email) => {
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(email);
};

// @desc    Create a new client
// @route   POST /api/clients
// @access  Private (Freelancer only)
export const createClient = asyncHandler(async (req, res) => {
  const { name, email, phone, company, country, notes } = req.body;

  // Validate required fields
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: 'Client name and email are required'
    });
  }

  // Validate email format
  if (!isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }

  // Create client with owner set to authenticated user
  const client = await Client.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    phone: phone ? phone.trim() : '',
    company: company ? company.trim() : '',
    country: country ? country.trim() : '',
    notes: notes ? notes.trim() : '',
    owner: req.user._id
  });

  res.status(201).json({
    success: true,
    message: 'Client created successfully',
    client
  });
});

// @desc    Get all clients for the logged-in freelancer
// @route   GET /api/clients
// @access  Private (Freelancer only)
export const getClients = asyncHandler(async (req, res) => {
  const clients = await Client.find({ owner: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: clients.length,
    clients
  });
});

// @desc    Get a single client by ID (ownership protected)
// @route   GET /api/clients/:id
// @access  Private (Freelancer only)
export const getClient = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid client ID format'
    });
  }

  const client = await Client.findById(id);

  if (!client) {
    return res.status(404).json({
      success: false,
      message: 'Client not found'
    });
  }

  // Verify ownership
  if (client.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this client'
    });
  }

  res.status(200).json({
    success: true,
    client
  });
});

// @desc    Update a client by ID (ownership protected)
// @route   PUT /api/clients/:id
// @access  Private (Freelancer only)
export const updateClient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, company, country, notes } = req.body;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid client ID format'
    });
  }

  const client = await Client.findById(id);

  if (!client) {
    return res.status(404).json({
      success: false,
      message: 'Client not found'
    });
  }

  // Verify ownership
  if (client.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this client'
    });
  }

  // Validate email if updated
  if (email && !isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }

  // Update fields if provided
  if (name !== undefined) client.name = name.trim();
  if (email !== undefined) client.email = email.toLowerCase().trim();
  if (phone !== undefined) client.phone = phone.trim();
  if (company !== undefined) client.company = company.trim();
  if (country !== undefined) client.country = country.trim();
  if (notes !== undefined) client.notes = notes.trim();

  const updatedClient = await client.save();

  res.status(200).json({
    success: true,
    message: 'Client updated successfully',
    client: updatedClient
  });
});

// @desc    Delete a client by ID (ownership protected)
// @route   DELETE /api/clients/:id
// @access  Private (Freelancer only)
export const deleteClient = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid client ID format'
    });
  }

  const client = await Client.findById(id);

  if (!client) {
    return res.status(404).json({
      success: false,
      message: 'Client not found'
    });
  }

  // Verify ownership
  if (client.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this client'
    });
  }

  await client.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Client deleted successfully'
  });
});
