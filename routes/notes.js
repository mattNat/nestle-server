'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Note = require('../models/note');

/* ========== GET/READ ALL ITEMS ========== */
router.get('notes', (req, res, next) => {
  const { searchTerm } = req.query;
  const { folderId } = req.query;

  let filter = {};
  let projection = {};
  let sort = 'created'; // default sorting
  
  if (searchTerm) {
    // console.log(searchTerm);
    // something to do with index we set up
    // mongo
    filter.$text = { $search: searchTerm };

    console.log('FILTER IS: ', filter.$text);
    

    projection.score = { $meta: 'textScore' };
    sort = projection;
  }

  
  if (folderId) {
    // filter.$text = { $search: folderId };
    filter.folderId = folderId;
    // projection.score = { $meta: 'textScore' };
    // sort = projection;
  }

  Note.find(filter, projection)
    .select('ascent conditionDate conditionDetails conditionStatus descent difficulty high id imgMedium imgSmall imgSmallMed imgSqSmall latitude length location longitude low name starVotes stars summary type url user comment date')
    .sort(sort)
    .then(results => {
      res.json(results);
    })
    .catch(next);
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('notes/:id', (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Note.findById(id)
    .select('ascent conditionDate conditionDetails conditionStatus descent difficulty high id imgMedium imgSmall imgSmallMed imgSqSmall latitude length location longitude low name starVotes stars summary type url user comment date')
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(next);
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('notes', (req, res, next) => {
  console.log('req body is:', req.body);
  
  const { 
    user, 
    comment, 
    date,
    ascent,
    conditionDate,
    conditionDetails,
    conditionStatus,
    descent,
    difficulty,
    high,
    id,
    imgMedium,
    imgSmall,
    imgSmallMed,
    imgSqSmall,
    latitude,
    length,
    location,
    longitude,
    low,
    name,
    starVotes,
    stars,
    summary,
    type,
    url
  } = req.body;
  
  /***** Never trust users - validate input *****/
  // if (!title) {
  //   const err = new Error('Missing `title` in request body');
  //   err.status = 400;
  //   return next(err);
  // }
  
  const newItem = { 
    user, 
    comment, 
    date,
    ascent,
    conditionDate,
    conditionDetails,
    conditionStatus,
    descent,
    difficulty,
    high,
    id,
    imgMedium,
    imgSmall,
    imgSmallMed,
    imgSqSmall,
    latitude,
    length,
    location,
    longitude,
    low,
    name,
    starVotes,
    stars,
    summary,
    type,
    url
  };

  Note.create(newItem)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(next);
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('notes/:id', (req, res, next) => {
  const { id } = req.params;
  const { user, comment, date } = req.body;

  /***** Never trust users - validate input *****/
  if (!user) {
    const err = new Error('Missing `user` in request body');
    err.status = 400;
    return next(err);
  }

  if (!comment) {
    const err = new Error('Missing `comment` in request body');
    err.status = 400;
    return next(err);
  }

  if (!date) {
    const err = new Error('Missing `date` in request body');
    err.status = 400;
    return next(err);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  const updateItem = { user, comment, date };
  const options = { new: true };

  Note.findByIdAndUpdate(id, updateItem, options)
    .select('id user comment')
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(next);
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('notes/:id', (req, res, next) => {
  const { id } = req.params;

  Note.findByIdAndRemove(id)
    .then(count => {
      if (count) {
        res.status(204).end();
      } else {
        next();
      }
    })
    .catch(next);
});

module.exports = router;