const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateActivity } = require('../middleware');

const Activity = require('../models/activity');

router.get('/', catchAsync(async (req, res) => {
    const activities = await Activity.find({});
    res.render('activities/index', { activities })
}));

router.get('/food', catchAsync(async (req, res) => {
    const activities = await Activity.find({type: 'Food'});
    res.render('activities/index', { activities })
}));

router.get('/events', catchAsync(async (req, res) => {
    const activities = await Activity.find({type: 'Event'});
    res.render('activities/index', { activities })
}));

router.get('/night-life', catchAsync(async (req, res) => {
    const activities = await Activity.find({type: 'Night-life'});
    res.render('activities/index', { activities })
}));

router.get('/outdoors', catchAsync(async (req, res) => {
    const activities = await Activity.find({type: 'Outdoors'});
    res.render('activities/index', { activities })
}));

router.get('/shopping', catchAsync(async (req, res) => {
    const activities = await Activity.find({type: 'Shopping'});
    res.render('activities/index', { activities })
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('activities/new');
})


router.post('/', isLoggedIn, validateActivity, catchAsync(async (req, res, next) => {
    const activity = new Activity(req.body.activity);
    activity.author = req.user._id;
    await activity.save();
    req.flash('success', 'Successfully made a new activity!');
    res.redirect(`/activities/${activity._id}`)
}))

router.get('/:id', catchAsync(async (req, res,) => {
    const activity = await Activity.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(activity);
    if (!activity) {
        req.flash('error', 'Cannot find that activity!');
        return res.redirect('/activities');
    }
    res.render('activities/show', { activity });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const activity = await Activity.findById(id)
    if (!activity) {
        req.flash('error', 'Cannot find that activity!');
        return res.redirect('/activities');
    }
    res.render('activities/edit', { activity });
}))

router.put('/:id', isLoggedIn, isAuthor, validateActivity, catchAsync(async (req, res) => {
    const { id } = req.params;
    const activity = await Activity.findByIdAndUpdate(id, { ...req.body.activity });
    req.flash('success', 'Successfully updated activity!');
    res.redirect(`/activities/${activity._id}`)
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Activity.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted activity')
    res.redirect('/activities');
}));

module.exports = router;