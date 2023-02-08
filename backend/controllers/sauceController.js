const Sauce = require('../models/sauceModel');
const fs = require('fs');

////////////////////////////////////////////////////
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  console.log(sauceObject);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
  });

  console.log(req.file);
  console.log(req.file.filename);
  console.log(sauce);
  sauce
    .save()
    .then(() => {
      res.status(201).json({ message: 'sauce enregistrée !' });
    })
    .catch((err) => {
      res.status(400).json({ err });
    });
};
////////////////////////////////////////////////////
////////////////////////////////////////////////////
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });
      } else {
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => {
            res.status(200).json({ message: 'Sauce modifiée !' });
          })
          .catch((err) => res.status(401).json({ err }));
      }
    })
    .catch((err) => res.status(400).json({ err }));
};
////////////////////////////////////////////////////

////////////////////////////////////////////////////
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((err) => res.status(400).json({ err }));
};
////////////////////////////////////////////////////

////////////////////////////////////////////////////
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((err) => res.status(400).json({ err }));
};
////////////////////////////////////////////////////

////////////////////////////////////////////////////
// exports.deleteSauce = (req, res, next) => {
//   Sauce.findOne({ _id: req.params.id })
//     .then((sauce) => {
//       if (sauce.userId != req.auth.userId) {
//         res.status(401).json({ message: 'Not authorized' });
//       } else {
//         const filename = sauce.imageUrl.split('/images/')[1];
//         fs.unlink(`images/${filename}`, () => {
//           Sauce.deleteOne({ _id: req.params.id })
//             .then(() => {
//               res.status(200).json({ message: 'Sauce supprimée !' });
//             })
//             .catch((err) => res.status(401).json({ err }));
//         });
//       }
//     })
//     .catch((err) => res.status(500).json({ err }));
// };
////////////////////////////////////////////////////
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });
      } else {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: 'Sauce supprimée !' });
            })
            .catch((err) => res.status(401).json({ err }));
        });
      }
    })
    .catch((err) => res.status(500).json({ err }));
};
////////////////////////////////////////////////////

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// exports.likesDislikes = (req, res, next) => {
//   console.log('Je suis dans la fonction like !!');

//   //affichage du corps de la requete
//   // console.log(req.body);
//   //affichage des paramètres de la requete
//   // console.log(req.params);
//   //mise au format de l'id pour aller chercher l'objet corresponsant
//   // console.log({ _id: req.params.id });

//   //aller chercher l'objet dans la base de données
//   Sauce.findOne({ _id: req.params.id })
//     .then((sauce) => {
//       // console.log(sauce);
//       //like = 1 (likes = +1)
//       if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
//         Sauce.updateOne(
//           { _id: req.params.id },
//           {
//             $inc: { likes: req.body.like },
//             $push: { usersLiked: req.body.userId },
//           }
//         )
//           .then(() => res.status(201).json({ message: 'sauce like' }))
//           .catch((err) => res.status(400).json({ err }));
//       }

//       //like = 0 (likes = 0, pas de vote)
//       if (sauce.usersLiked.includes(req.body.userId) && req.body.like === 0) {
//         Sauce.updateOne(
//           { _id: req.params.id },
//           {
//             $inc: { likes: -1 },
//             $pull: { usersLiked: req.body.userId },
//           }
//         )
//           .then(() => res.status(201).json({ message: 'sauce dislike' }))
//           .catch((err) => res.status(400).json({ err }));
//       }

//       //like = -1 (dislikes = +1)
//       if (
//         !sauce.usersDisliked.includes(req.body.userId) &&
//         req.body.like === -1
//       ) {
//         Sauce.updateOne(
//           { _id: req.params.id },
//           {
//             $inc: { dislikes: 1 },
//             $push: { usersDisliked: req.body.userId },
//           }
//         )
//           .then(() => res.status(201).json({ message: 'sauce dislike' }))
//           .catch((err) => res.status(400).json({ err }));
//       }
//       //like = 0 (dislikes = 0)
//       if (
//         sauce.usersDisliked.includes(req.body.userId) &&
//         req.body.like === 0
//       ) {
//         Sauce.updateOne(
//           { _id: req.params.id },
//           {
//             $inc: { dislikes: -1 },
//             $pull: { usersDisliked: req.body.userId },
//           }
//         )
//           .then(() => res.status(201).json({ message: 'sauce dislike' }))
//           .catch((err) => res.status(400).json({ err }));
//       }
//     })
//     .catch((err) => res.status(401).json({ err }));
// };
/////////////////////////////////////////////////
/////////////////////////////////////////////////
exports.likesDislikes = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { likes: 1 },
            $push: { usersLiked: req.body.userId },
          }
        )
          .then(() => res.status(201).json({ message: 'sauce like' }))
          .catch((err) => res.status(400).json({ err }));
      } else if (
        sauce.usersLiked.includes(req.body.userId) &&
        req.body.like === 0
      ) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { likes: -1 },
            $pull: { usersLiked: req.body.userId },
          }
        )
          .then(() => res.status(201).json({ message: 'sauce dislike' }))
          .catch((err) => res.status(400).json({ err }));
      }

      if (
        !sauce.usersDisliked.includes(req.body.userId) &&
        req.body.like === -1
      ) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { dislikes: 1 },
            $push: { usersDisliked: req.body.userId },
          }
        )
          .then(() => res.status(201).json({ message: 'sauce dislike' }))
          .catch((err) => res.status(400).json({ err }));
      }
      //like = 0 (dislikes = 0)
      else if (
        sauce.usersDisliked.includes(req.body.userId) &&
        req.body.like === 0
      ) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { dislikes: -1 },
            $pull: { usersDisliked: req.body.userId },
          }
        )
          .then(() => res.status(201).json({ message: 'sauce dislike' }))
          .catch((err) => res.status(400).json({ err }));
      }
    })
    .catch((err) => res.status(401).json({ err }));
};
/////////////////////////////////////////////////
/////////////////////////////////////////////////
exports.likesDislikes = (req, res, next) => {
  const sauceId = req.params.id;
  const userId = req.body.userId;
  const like = req.body.like;

  if (like === 1) {
    Sauce.updateOne(
      { _id: sauceId },
      {
        $inc: { likes: like },
        $push: { usersLiked: userId },
      }
    )
      .then(() => res.status(200).json({ message: 'Sauce appréciée' }))
      .catch((error) => res.status(500).json({ error }));
  } else if (like === -1) {
    Sauce.updateOne(
      { _id: sauceId },
      {
        $inc: { dislikes: -1 * like },
        $push: { usersDisliked: userId },
      }
    )
      .then(() => res.status(200).json({ message: 'Sauce dépréciée' }))
      .catch((error) => res.status(500).json({ error }));
  } else {
    Sauce.findOne({ _id: sauceId })
      .then((sauce) => {
        if (sauce.usersLiked.includes(userId)) {
          Sauce.updateOne(
            { _id: sauceId },
            { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
          )
            .then((sauce) => {
              res.status(200).json({ message: 'Sauce dépréciée' });
            })
            .catch((error) => res.status(500).json({ error }));
        } else if (sauce.usersDisliked.includes(userId)) {
          Sauce.updateOne(
            { _id: sauceId },
            {
              $pull: { usersDisliked: userId },
              $inc: { dislikes: -1 },
            }
          )
            .then((sauce) => {
              res.status(200).json({ message: 'Sauce appréciée' });
            })
            .catch((error) => res.status(500).json({ error }));
        }
      })
      .catch((error) => res.status(401).json({ error }));
  }
};
/////////////////////////////////////////////////
