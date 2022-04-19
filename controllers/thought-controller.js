const res = require("express/lib/response");
const { Thought, User } = require("../models");

const thoughtController = {
  getAllThoughts(req, res) {
    Thought.find({})
      .select("-__v")
      .then((data) => res.json(data))
  },

  getOneThoughtById({ params }, res) {
    Thought.findOne({ _id: params.thoughtId })
      .then((data) => {
        if (!data) {
          res.status(404).json({ message: "There is no thought with this specific ID" });
          return;
        }
        res.json(data);
      })
  },

  createThought({ body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((data) => {
        if (!data) {
          res.status(404).json({ message: "There is no user with this specific ID" });
          return;
        }
        res.json(data);
      })
  },

  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.thoughtId }, body, {
      new: true,
      runValidators: true,
    })
      .then((data) => {
        if (!data) {
          res.status(404).json({ message: "There is no thought with this specific ID" });
          return;
        }
        res.json(data);
      })
  },

  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then((data) => {
        if (!data) {
          res.status(404).json({ message: "There is no thought with this specific ID" });
          return;
        }
        res.json({ message: "The thought deleted successfully!" });
      })
  },

  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true }
    )
      .then((data) => {
        if (!data) {
          res.status(404).json({ message: "There is no thought with this specific ID" });
          return;
        }
        res.json(data);
      })
  },

  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then((data) => {
        if (!data) {
          res.status(404).json({ message: "There is no thought with this specific ID" });
          return;
        }
        res.json(data);
      })
  },
};

module.exports = thoughtController;