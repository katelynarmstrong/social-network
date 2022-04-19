const { User, Thought } = require('../models')

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
        .populate('thought')
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

    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.userId })
        .then((deletedUserData) => {
          if (!deletedUserData) {
            res.status(404).json({ message: "There is no user with this ID" });
            return;
          }
  
          Thought.deleteMany({ username: deletedUserData.username })
            .then(res.json({ message: "User and associated thoughts deleted successfully!" }))
            .catch((err) => res.status(400).json(err));
        })
    },

    addFriend({ params }, res) {
        User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { friends: params.friendId } },
          { new: true }
        )
          .then((data) => res.json(data))
      },

      removeFriend({ params }, res) {
        User.findOneAndUpdate(
          { _id: params.userId },
          { $pull: { friends: params.friendId } },
          { new: true }
        )
          .then((data) => res.json(data))
      },

};

module.exports = userController