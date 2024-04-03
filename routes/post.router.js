const express = require('express');
const router = express.Router();
const PostService = require('../services/post.service');
const service = new PostService();
const passport = require('passport');

//POSTS
router.post('/create', async (req, res, next) => {
  const idUser = req.user.sub;
  req.body.user = idUser;

  try {
    const response = await service.createPost({ ...req.body }); // AÑADE UN NUEVO POST
    res.status(200).json({ data: response });
  } catch (e) {
    next(e);
  }
});

//POSTS ESPECIFICOS
router.get('/byuser/', async (req, res, next) => {
  const idUser = req.user.sub;
  const page = req.query.page;

  try {
    const response = await service.findPostByUser(idUser, page); // BUSCA POSTS POR USUARIO
    res.status(200).json({ data: response });
  } catch (e) {
    next(e);
  }
});

router.get('/', async (req, res, next) => {
  const page = req.query.page;
  try {
    const response = await service.findAllPost(page); // ENLISTA TODOS LOS POST
    res.status(200).json({ data: response });
  } catch (e) {
    next(e);
  }
});

router.get('/lastPost', async (req, res, next) => {
  const idUser = req.user.sub;
  try {
    const response = await service.findLastPostUser(idUser); // ENLISTA TODOS LOS POST
    res.status(200).json({ data: response });
  } catch (e) {
    next(e);
  }
});

router.get('/uris', async (req, res, next) => {
  try {
    const response = await service.findUries(); // ENLISTA TODOS LOS POST
    res.status(200).json({ data: response });
  } catch (e) {
    next(e);
  }
});

router.get('/lastPostAdmin/:idUser', async (req, res, next) => {
  const { idUser } = req.params;
  try {
    const response = await service.findLastPostUser(idUser); // ENLISTA TODOS LOS POST
    res.status(200).json({ data: response });
  } catch (e) {
    next(e);
  }
});

//COMENTARIOS
router.post('/comments', async (req, res, next) => {
  const idUser = req.user.sub;
  try {
    const response = await service.createComment({ ...req.body}, idUser);
    res.status(200).json({ data: response }); // REGISTRAR NUEVO COMENTARIO
  } catch (e) {
    next(e);
  }
});

//LIKES
router.post('/likepost', async (req, res, next) => {
  const idUser = req.user.sub;
  try {
    const response = await service.likePostByUser({ ...req.body }, idUser); //AÑADE EL LIKE DEL USUARIO
    res.status(200).json({ data: response });
  } catch (e) {
    next(e);
  }
});

router.delete('/likepost/:idpost', async (req, res, next) => {
  const idUser = req.user.sub;
  const { idpost } = req.params;
  try {
    const response = await service.deleteLikePostByUser(idpost, idUser); // ELIMINA EL LIKE DEL USUARIO
    res.status(200).json({ data: response });
  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const response = await service.findPost(id); // BUSCA POST POR ID
    res.status(200).json({ data: response });
  } catch (e) {
    next(e);
  }
});

router.get('/comments/find/:idpost/', async (req, res, next) => {
  const { idpost} = req.params;
  const page = req.query.page;

  try {
    const response = await service.commentsByPost(idpost, page); // BUSCA LOS COMENTARIOS POR POST
    res.status(200).json({ data: response });
  } catch (e) {
    next(e);
  }
});


router.delete('/deletepost/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const response = await service.deletePost(id); // ELIMINA EL POST
    res.status(200).json({ data: response });
  } catch (e) {
    next(e);
  }
});

router.delete('/comments/delete/:idpost/:idcomment', async (req, res, next) => {
  const { idpost,  idcomment} = req.params;
  try {
    const response = await service.deleteComment(idpost,idcomment); // ELIMINA LOS COMENTARIOS POR ID DEL COMENTARIO
    res.status(200).json({ data: response });
  } catch (e) {
    next(e);1
  }
});

router.patch('/upImage', async (req, res, next) => {
  const {image} = req.body;
  try {
    const response = await service.updateImagePosts(image); 
    res.status(200).json({ data: response });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
