import mongoose from 'mongoose'

// utils/getUserModel.js

import user from '../models/user.js';  // Reuse the schema you made

// This object remembers created models (to avoid errors or duplicate models)
const modelCache = {};

export function getUserModel(collectionName) {
  const usersDB = mongoose.connection.useDb('Game');  // Use the right DB

  // If model for this collection doesn't exist yet, create it
  if (!modelCache[collectionName]) {
    modelCache[collectionName] = usersDB.model(
      collectionName,       // Name of the model
      user,           // The schema you're using
      collectionName        // Name of the actual collection in MongoDB
    );
  }

  // Return the model (either newly created or from cache)
  return modelCache[collectionName];
}