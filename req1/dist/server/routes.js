"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const authController_1 = require("./authController");
const auth_1 = require("./auth");
const routes = express_1.Router();
// auth routes
routes.post('/login', authController_1.login);
routes.post('/signup', authController_1.signup);
routes.post('/logout', authController_1.logout);
routes.post('/refresh_token', auth_1.authenticateRefresh, authController_1.refreshToken);
// get stories, by id, and by user id
routes.get('/stories', controller_1.getStories);
routes.get('/stories/:id', controller_1.getStory);
routes.get('/users/:id', controller_1.getUserStories);
// add, edit, or delete a story
routes.post('/stories', auth_1.authenticate, controller_1.addStory);
routes.put('/stories/:id', auth_1.authenticate, controller_1.editStory);
routes.delete('/stories/:id', auth_1.authenticate, controller_1.deleteStory);
// s3 upload url
routes.get('/s3upload/:filename', controller_1.getUploadUrl);
exports.default = routes;
//# sourceMappingURL=routes.js.map