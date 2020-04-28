var express = require('express');
var router = express.Router();
const Task = require('../models/task')

router.get('/createTask', (req, res) => {
    const newTask = new Task();


    newTask.save((err, data) => {
        if (err) {
            console.log(err);
            res.render('error')
        } else {
            res.redirect('/task/' + data._id);
        }
    })
})


router.get('/task/:id', (req, res) => {
    if (req.params.id) {
        Task.findOne({
            _id: req.params.id
        }, (err, data) => {
            if (err) {
                console.log(err);
                l
                res.render('error');
            }

            if (data) {
                res.render('task', {
                    content: data.content,
                    id: req.params.id,
                    roomId: data.id
                })
            } else {
                res.render('error')
            }
        })
    } else {
        res.render('error')
    }
})

module.exports = router