const mongoose = require('mongoose');
const postSchema = require('../schemas/post.schema');
const uriSchema = require('../schemas/uris.schema');
const boom = require('@hapi/boom');
const model = mongoose.model('posts', postSchema);
const modelUser = require('../schemas/user.schema');
const modelRoles = require('../schemas/role.schema');
const modelUris = mongoose.model('uris', uriSchema);

class PostService {
  async createPost(dataPost) {
    const random = Math.floor(Math.random() * 50) + 1;
    dataPost.likes = [];

    for (let i = 0; i < random; i++) {
      const id = new mongoose.Types.ObjectId();
      dataPost.likes[i] = {
        idUser: id.toString().substring(0, 10),
      };
    }

    const result = await new model({ ...dataPost });
    await result.save();
    return await result;
  }

  async findPostByUser(userId, page) {
    const result = await model.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * 30 },
      { $limit: 30 },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      { $sort: { createdAt: -1 } },
      { $unwind: '$userDetails' },
      {
        $lookup: {
          from: 'roles',
          localField: 'userDetails.roles',
          foreignField: '_id',
          as: 'rolesDetails',
        },
      },
      { $unwind: '$rolesDetails' },
      {
        $lookup: {
          from: 'members',
          localField: 'userDetails.member.idMember',
          foreignField: '_id',
          as: 'memberDetails',
        },
      },
      { $unwind: { path: '$memberDetails', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          user: {
            _id: { $ifNull: ['$userDetails._id', null] },
            name: { $ifNull: ['$userDetails.name', null] },
            nickname: { $ifNull: ['$userDetails.nickname', null] },
            image: { $ifNull: ['$userDetails.image', null] },
            status: { $ifNull: ['$userDetails.status', []] },
          },
          rolesDetails: {
            _id: { $ifNull: ['$rolesDetails._id', null] },
            name: { $ifNull: ['$rolesDetails.name', null] },
          },
          memberDetails: 1,
          memberActive: { $ifNull: ['$userDetails.member.active', false] },
          _id: 1,
          content: 1,
          contentType: 1,
          imageContent: 1,
          likes: 1,
          createdAt: 1,
          countLikes: { $size: '$likes' },
          countComments: { $size: '$comments' },
        },
      },
    ]);

    return await result;
  }

  async findAllPost(page) {
    const result = await model.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      { $sort: { createdAt: -1 } },
      { $unwind: '$userDetails' },
      {
        $lookup: {
          from: 'roles',
          localField: 'userDetails.roles',
          foreignField: '_id',
          as: 'rolesDetails',
        },
      },
      { $unwind: '$rolesDetails' },
      {
        $lookup: {
          from: 'members',
          localField: 'userDetails.member.idMember',
          foreignField: '_id',
          as: 'memberDetails',
        },
      },
      { $unwind: { path: '$memberDetails', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          user: {
            _id: { $ifNull: ['$userDetails._id', null] },
            name: { $ifNull: ['$userDetails.name', null] },
            nickname: { $ifNull: ['$userDetails.nickname', null] },
            image: { $ifNull: ['$userDetails.image', null] },
            status: { $ifNull: ['$userDetails.status', []] },
          },
          rolesDetails: {
            _id: { $ifNull: ['$rolesDetails._id', null] },
            name: { $ifNull: ['$rolesDetails.name', null] },
          },
          memberDetails: 1,
          memberActive: { $ifNull: ['$userDetails.member.active', false] },
          _id: 1,
          content: 1,
          contentType: 1,
          imageContent: 1,
          likes: 1,
          createdAt: 1,
          countLikes: { $size: '$likes' },
          countComments: { $size: '$comments' },
        },
      },
      {
        $match: {
          'user.status': {
            $not: {
              $elemMatch: {
                name: 'posts',
                value: false,
              },
            },
          },
        },
      },
      { $limit: 400 },
    ]);

    return await result;
  }

  async findLastPostUser(userId) {
    if (userId === 'communityManager') {
      const communityManagerRole = await modelRoles.findOne({
        name: 'communityManager',
      });
      const userCommunityManager = await modelUser
        .findOne({ roles: communityManagerRole._id })
        .exec();
      userId = userCommunityManager._id;
    }

    const result = await model.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $sort: { createdAt: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      { $unwind: '$userDetails' },
      {
        $lookup: {
          from: 'roles',
          localField: 'userDetails.roles',
          foreignField: '_id',
          as: 'rolesDetails',
        },
      },
      { $unwind: '$rolesDetails' },
      {
        $lookup: {
          from: 'members',
          localField: 'userDetails.member.idMember',
          foreignField: '_id',
          as: 'memberDetails',
        },
      },
      { $unwind: { path: '$memberDetails', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          user: {
            _id: { $ifNull: ['$userDetails._id', null] },
            name: { $ifNull: ['$userDetails.name', null] },
            nickname: { $ifNull: ['$userDetails.nickname', null] },
            image: { $ifNull: ['$userDetails.image', null] },
            status: { $ifNull: ['$userDetails.status', []] },
          },
          rolesDetails: {
            _id: { $ifNull: ['$rolesDetails._id', null] },
            name: { $ifNull: ['$rolesDetails.name', null] },
          },
          memberDetails: 1,
          memberActive: { $ifNull: ['$userDetails.member.active', false] },
          _id: 1,
          content: 1,
          contentType: 1,
          imageContent: 1,
          likes: 1,
          createdAt: 1,
          countLikes: { $size: '$likes' },
          countComments: { $size: '$comments' },
        },
      },
      {
        $match: {
          'user.status': {
            $not: {
              $elemMatch: {
                name: 'posts',
                value: false,
              },
            },
          },
        },
      },
    ]);
    return await result;
  }

  //ESTE METODO REGISTRA NUEVOS COMENTARIOS
  async createComment(data, idUser) {
    data.comments.user = idUser;
    data.comments.createdAt = new Date();
    const result = await model.updateMany(
      { _id: data.idPost },
      { $push: { comments: data.comments } },
    );
    return await result;
  }

  async findPost(idPost) {
    const result = await model.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(idPost), // Condición para campo1
        },
      },
      {
        $lookup: {
          from: 'users', // Reemplaza con el nombre de tu colección de usuarios
          localField: 'user',
          foreignField: '_id', // Campos que quieres obtener del usuario
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $lookup: {
          from: 'roles',
          localField: 'user.roles',
          foreignField: '_id',
          as: 'rolesDetails',
        },
      },
      { $unwind: '$rolesDetails' },
      {
        $lookup: {
          from: 'members',
          localField: 'user.member.idMember',
          foreignField: '_id',
          as: 'memberDetails',
        },
      },
      { $unwind: { path: '$memberDetails', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          user: {
            _id: 1,
            name: 1,
            nickname: 1,
            image: 1,
            status: 1,
          },
          _id: 1,
          content: 1,
          contentType: 1,
          imageContent: 1,
          rolesDetails: {
            _id: { $ifNull: ['$rolesDetails._id', null] },
            name: { $ifNull: ['$rolesDetails.name', null] },
          },
          memberDetails: 1,
          memberActive: { $ifNull: ['$user.member.active', false] },
          // "likes": 1,
          createdAt: 1,
          countLikes: { $size: '$likes' },
          comments: 1,
        },
      },
    ]);

    if (result.length === 0) {
      throw boom.notFound('Post not found');
    } else {
      const findStatus = result[0].user.status.find(
        (status) => status.name === 'posts',
      );
      if (findStatus) {
        if (findStatus.value === false) {
          throw boom.notFound('Post not found');
        }
      }
      const count = await this.countCommentsPost(idPost);
      result[0].countComments = count;
    }
    return await result;
  }

  async commentsByPost(idPost, page) {
    const result = await model
      .findOne({ _id: idPost }, 'comments')
      .populate({
        path: 'comments.user',
        model: 'user',
        select: 'name nickname image member roles status',
        populate: [
          {
            path: 'roles',
            model: 'roles',
          },
          {
            path: 'member.idMember',
            model: 'members',
          },
        ],
      })
      .exec();

    const filterUserStatus = result.comments.filter((comment) => {
      const findStatus = comment.user.status.find(
        (status) => status.name === 'posts',
      );
      if (findStatus) {
        if (findStatus.value === false) {
          return false;
        }
      }
      return true;
    });

    // Ahora, result contiene los comentarios filtrados
    const commentsPage = filterUserStatus
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice((page - 1) * 165, page * 165);

    return await commentsPage;
  }

  async deleteLikePostByUser(idpost, iduser) {
    const result = await model.updateMany(
      { _id: idpost },
      { $pull: { likes: { idUser: iduser } } },
    );
    return await result;
  }

  async likePostByUser(dataPost, idUser) {
    dataPost.likes = {
      idUser: idUser,
    };
    const result = await model.updateMany(
      { _id: dataPost.idPost },
      { $push: { likes: dataPost.likes } },
    );
    return await result;
  }

  async deletePost(idPost) {
    const result = await model.deleteOne({ _id: idPost });
    return await result;
  }

  async deleteComment(idpost, idcomment) {
    const result = await model.updateMany(
      { _id: idpost },
      { $pull: { comments: { _id: idcomment } } },
    );
    return await result;
  }

  async updateImagePosts(image) {
    const result = await model.updateMany(
      {},
      { $set: { imageContent: image } },
    );
    return await result;
  }

  async countCommentsPost(idPost) {
    const result = await model
      .findOne({ _id: idPost }, 'comments')
      .populate({
        path: 'comments.user',
        model: 'user',
        select: 'name nickname image member roles status',
        populate: [
          {
            path: 'roles',
            model: 'roles',
          },
          {
            path: 'member.idMember',
            model: 'members',
          },
        ],
      })
      .exec();

    const filterUserStatus = result.comments.filter((comment) => {
      const findStatus = comment.user.status.find(
        (status) => status.name === 'posts',
      );
      if (findStatus) {
        if (findStatus.value === false) {
          return false;
        }
      }
      return true;
    });
    return await filterUserStatus.length;
  }

  async findUries() {
    const result = await modelUris.find();
    return await result;
  }
}

module.exports = PostService;
