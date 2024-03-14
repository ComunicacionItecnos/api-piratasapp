const mongoose = require('mongoose');
const modelSchema = require('../schemas/stream.schema');
const model = mongoose.model('streams', modelSchema);
const modelUser = require('../schemas/user.schema');
const modelRoles = require('../schemas/role.schema');
const boom = require('@hapi/boom');

class memberService {
    async find(userId) {
        const session = await model.startSession();
        session.startTransaction();
        try {

            const communityManagerRole = await modelRoles.findOne({ name: 'communityManager' });
            const userCommunityManager = await modelUser.findOne({ roles: communityManagerRole._id }).exec();
            const result = await model.aggregate([
                {
                    $sort: { "createdAt": -1 } // Ordena por createdAt en orden descendente
                },
                {
                    $addFields: {
                        "isLiked": {
                            $in: [userId, '$likes.idUser'] // Comprueba si userId está en el arreglo de likes
                        },
                        "countLikes": { "$size": '$likes' },
                        "userCommunityManager": userCommunityManager.image
                    }
                },
                {
                    $project: {
                        name: 1,
                        uri: 1,
                        isLiked: 1,
                        countLikes: 1,
                        userCommunityManager: 1
                    }
                },
                {
                    $limit: 150 // Limita los resultados a 2 documentos
                }
            ])

            session.commitTransaction();
            session.endSession();
            return await result;
        } catch (e) {
            session.abortTransaction();
            session.endSession();
            throw boom.badRequest('Error');
        }


    }

    async findById(userId, idStream) {
        const result = await model.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(idStream) }
            },
            {
                $addFields: {
                    "isLiked": {
                        $in: [userId, '$likes.idUser'] // Comprueba si userId está en el arreglo de likes
                    },
                    "countLikes": { "$size": '$likes' }
                }
            },
            {
                $project: {
                    name: 1,
                    uri: 1,
                    isLiked: 1,
                    countLikes: 1
                }
            }
        ]);
        return await result;
    }

    async create(data, idUser) {
        data.userEdit = idUser;
        data.status = true;

        const random = Math.floor(Math.random() * 50) + 1;
        data.likes = [];

        for (let i = 0; i < random; i++) {
            const id = new mongoose.Types.ObjectId()
            data.likes[i] = {
                idUser: id.toString().substring(0, 10)
            }
        }

        const result = await new model({ ...data });
        await result.save();
        return await result;
    }

    async deleteLike(idStream, idUser) {
        const result = await model.updateOne({ "_id": idStream }, { $pull: { "likes": { "idUser": idUser } } });
        return await result;
    }

    async addLike(data, idUser) {
        data.likes = {
            idUser: idUser,
        };
        const result = await model.updateOne({ "_id": data.idStream }, { $push: { 'likes': data.likes } });
        return await result;
    }

    async delete(idStream) {
        const result = await model.deleteOne({ _id: idStream });
        return await result;
    }


}

module.exports = memberService;
