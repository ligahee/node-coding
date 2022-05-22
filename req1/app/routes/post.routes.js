const { authJwt } = require("../middleware");
const extractFile = require('../middleware/file');
const controller = require("../controllers/post.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


  app.put(
      '/api/auth/all/:id',
      [authJwt.verifyToken],
      extractFile,
      controller.updatePost
      );
  
 app.get(
        '/api/auth/all',
        controller.getPosts
        );

 app.get(
       '/:id',
        controller.getPost
        );

 app.delete(
       '/:id',
        controller.deletePost
        );
};
