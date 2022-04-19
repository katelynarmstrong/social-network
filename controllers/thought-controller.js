const { Thought, User } = require("../models");

const thoughtController = {
  createThought(req, res) {
    Thought.create(req.body)
      .then((dbThoughtData) => {
        return User.findOneAndUpdate(
          { _id: req.params.userId },
          { $push: { thought: dbThoughtData._id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'Thought created but no user with this id!' });
        }

        res.json({ message: 'Thought successfully created!' });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  getAllThoughts(req, res) {
    Thought.find({})
      .select("-__v")
      .then((data) => res.json(data));
  },

  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.thoughtId }).then((data) => {
      if (!data) {
        res
          .status(404)
          .json({ message: "There is no thought with this specific ID" });
        return;
      }
      res.json(data);
    });
  },

  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.thoughtId }, body, {
      new: true,
      runValidators: true,
    }).then((data) => {
      if (!data) {
        res
          .status(404)
          .json({ message: "There is no thought with this specific ID" });
        return;
      }
      res.json(data);
    });
  },

  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId }).then((data) => {
      if (!data) {
        res
          .status(404)
          .json({ message: "There is no thought with this specific ID" });
        return;
      }
      res.json({ message: "The thought deleted successfully!" });
    });
  },

  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true }
    ).then((data) => {
      if (!data) {
        res
          .status(404)
          .json({ message: "There is no thought with this specific ID" });
        return;
      }
      res.json(data);
    });
  },

  deleteReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    ).then((data) => {
      if (!data) {
        res
          .status(404)
          .json({ message: "There is no thought with this specific ID" });
        return;
      }
      res.json(data);
    });
  },
};

module.exports = thoughtController;
