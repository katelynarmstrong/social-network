const { User } = require('../models')

const userController = {
    getUsers(req, res) {
        User.find()
        .select('-__v')
        .then((dbUser) => {
            res.json(dbUser)
        })
    },

    getOneUser(req, res) {
        User.findOne({_id: req.params.userId})
        .select('-__v')
        .populate('friends')
        // .populate('thought')
        .then((dbUser) => {
            if (!dbUser) {
                return res.json({message: "User does not exist"})
            }
            res.json(dbUser)
        })
    },

    createUser(req, res) {
        User.create(req.body)
        .then((dbUser) => {
            res.json(dbUser)
        })
    },

    updateUser(req, res) {
        User.findOneAndUpdate(
            {_id: req.params.userId},
            {$set: req.body},
            {runValidators: true, new: true}
        )
        .then((dbUser) => {
            if (!dbUser) {
                return res.json({message: "User does not exist"})
            }
            res.json(dbUser)
        })
    },

}

module.exports = userController