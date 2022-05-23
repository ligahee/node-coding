"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenExpire = exports.accessTokenExpire = exports.authenticateRefresh = exports.authenticate = exports.createRefreshToken = exports.createAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const accessTokenExpire = 60 * 5; // 5 minutes
exports.accessTokenExpire = accessTokenExpire;
const refreshTokenExpire = "7d";
exports.refreshTokenExpire = refreshTokenExpire;
const createAccessToken = (user) => {
    return jsonwebtoken_1.default.sign(user, process.env.JWT_SECRET, { expiresIn: accessTokenExpire });
};
exports.createAccessToken = createAccessToken;
const createRefreshToken = (user) => {
    return jsonwebtoken_1.default.sign(user, process.env.REFRESH_SECRET, { expiresIn: refreshTokenExpire });
};
exports.createRefreshToken = createRefreshToken;
const authenticate = (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization;
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err)
                res.sendStatus(401);
            else
                next();
        });
    }
    else {
        res.sendStatus(401);
    }
};
exports.authenticate = authenticate;
const authenticateRefresh = (req, res, next) => {
    const { cookies } = req;
    if ('rt' in cookies && cookies['rt']) {
        jsonwebtoken_1.default.verify(cookies['rt'], process.env.REFRESH_SECRET, (err, _) => {
            if (err)
                res.status(401).json({ ok: 'false', rt: '' });
            else
                next();
        });
    }
    else {
        res.status(401).json({ ok: 'false', rt: '' });
    }
};
exports.authenticateRefresh = authenticateRefresh;
//# sourceMappingURL=auth.js.map