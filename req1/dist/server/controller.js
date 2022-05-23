"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUploadUrl = exports.deleteStory = exports.editStory = exports.addStory = exports.getUserStories = exports.getStory = exports.getStories = void 0;
const index_1 = __importDefault(require("./db/index"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = require("express");
const s3_1 = require("./s3");
const DEFAULT_LIMIT = 6;
const getStories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || DEFAULT_LIMIT;
    let offset = (page - 1) * limit;
    let total = yield index_1.default.query('SELECT count(*) FROM stories');
    let result = yield index_1.default.query('SELECT stories.*, users.email, users.avatar_color FROM stories JOIN users ON stories.user_id = users.id ORDER BY date_added DESC LIMIT $1 OFFSET $2', [limit, offset]);
    let pages = Math.ceil(Number(total.rows[0].count) / limit);
    return res.status(200).json({
        total: { stories: total.rows[0].count, pages },
        page,
        rows: result.rows
    });
});
exports.getStories = getStories;
const getStory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield index_1.default.query('SELECT * FROM stories WHERE id=$1', [req.params.id]);
    if (result.rowCount === 0)
        return express_1.response.sendStatus(404);
    return res.status(200).json(result.rows[0]);
});
exports.getStory = getStory;
const getUserStories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || DEFAULT_LIMIT;
    const offset = (page - 1) * limit;
    const user = yield index_1.default.query('SELECT id FROM users WHERE id=$1', [req.params.id]);
    if (user.rowCount === 0)
        return express_1.response.sendStatus(404);
    let total = yield index_1.default.query('SELECT count(*) FROM stories WHERE user_id=$1', [req.params.id]);
    let result = yield index_1.default.query('SELECT stories.*, users.email, users.avatar_color FROM stories JOIN users ON stories.user_id = users.id WHERE users.id=$1 ORDER BY date_added DESC LIMIT $2 OFFSET $3', [req.params.id, limit, offset]);
    const pages = Math.ceil(Number(total.rows[0].count) / limit);
    return res.status(200).json({
        total: { stories: total.rows[0].count, pages },
        page,
        rows: result.rows
    });
});
exports.getUserStories = getUserStories;
const addStory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const title = req.body.title;
    const content = req.body.content;
    const photo_url = req.body.photo_url;
    if (!title || !content) {
        return res.json({ error: 'title and content required' });
    }
    const addedStory = yield index_1.default.query('INSERT INTO stories (title, content, photo_url, user_id) VALUES ($1, $2, $3, $4) RETURNING *', [title, content, photo_url, userId]);
    return res.status(200).json(addedStory.rows[0]);
});
exports.addStory = addStory;
const editStory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const title = req.body.title;
    const content = req.body.content;
    const photo_url = req.body.photo_url;
    const storyId = Number(req.params.id);
    if (!title || !content) {
        return res.json({ error: 'title and content required' });
    }
    const editedStory = yield index_1.default.query('UPDATE stories SET title=$1, content=$2, photo_url=$3 WHERE id=$4 AND user_id=$5 RETURNING *', [title, content, photo_url, storyId, userId]);
    return res.status(200).json(editedStory.rows[0]);
});
exports.editStory = editStory;
const deleteStory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    const userId = decode.userId;
    const storyId = req.params.id;
    const deletedStory = yield index_1.default.query('DELETE FROM stories WHERE id=$1 AND user_id=$2 RETURNING *', [storyId, userId]);
    return res.status(200).json(deletedStory.rows[0]);
});
exports.deleteStory = deleteStory;
const getUploadUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fileName = req.params.filename;
    const url = yield s3_1.generateUploadUrl(fileName);
    return res.status(200).json(url);
});
exports.getUploadUrl = getUploadUrl;
//# sourceMappingURL=controller.js.map