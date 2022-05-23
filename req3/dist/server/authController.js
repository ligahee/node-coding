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
exports.logout = exports.refreshToken = exports.signup = exports.login = void 0;
const index_1 = __importDefault(require("./db/index"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("./auth");
const cookieOps = {
    httpOnly: true,
    secure: true,
    sameSite: "none"
};
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return res.json({ error: 'email and password required' });
    }
    let user = yield index_1.default.query('SELECT * FROM users WHERE LOWER(email)=$1', [email.toLowerCase()]);
    if (user.rowCount === 1) {
        // user is already registered. validate password and send token
        user = user.rows[0];
        try {
            const compareRes = yield bcryptjs_1.default.compare(password, user.password_hash);
            if (compareRes) {
                let payload = {
                    userId: user.id,
                    email: user.email,
                    avatar: user.avatar_color
                };
                res.cookie('rt', auth_1.createRefreshToken(payload), Object.assign({ expires: new Date(Date.now() + auth_1.refreshTokenExpire) }, cookieOps));
                return res.status(200).json({
                    accessToken: auth_1.createAccessToken(payload),
                    expire: auth_1.accessTokenExpire
                });
            }
            else { // password is invalid
                return res.status(401).json({ error: 'Invalid password' });
            }
        }
        catch (err) {
            console.log(err);
            return res.status(401).json({ error: 'Something went wrong while authenticating' });
        }
    }
    else { // user doesn't exist 
        return res.status(404).json({ error: 'Email has not been registered yet.' });
    }
});
exports.login = login;
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.signupEmail;
    const password = req.body.signupPassword;
    if (!email || !password) {
        return res.json({ error: 'email and password required' });
    }
    let user = yield index_1.default.query('SELECT * FROM users WHERE LOWER(email)=$1', [email.toLowerCase()]);
    if (user.rowCount === 0) {
        try {
            const password_hash = yield bcryptjs_1.default.hash(password, 10);
            const user_color = colorGenerator();
            user = yield index_1.default.query('INSERT INTO users (email, password_hash, avatar_color) VALUES ($1, $2, $3) RETURNING *', [email, password_hash, user_color]);
            user = user.rows[0];
            let payload = {
                userId: user.id,
                email: user.email,
                avatar: user.avatar_color
            };
            res.cookie('rt', auth_1.createRefreshToken(payload), Object.assign({ expires: new Date(Date.now() + auth_1.refreshTokenExpire) }, cookieOps));
            return res.status(200).json({ accessToken: auth_1.createAccessToken(payload), expire: auth_1.accessTokenExpire });
        }
        catch (err) {
            return res.status(400).json({ error: err });
        }
    }
    else {
        return res.status(400).json({ error: 'A user has already been registered to that email address.' });
    }
});
exports.signup = signup;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.rt;
    const decoded = jsonwebtoken_1.default.verify(token, process.env.REFRESH_SECRET);
    let user = {
        userId: decoded.userId,
        email: decoded.email,
        avatar: decoded.avatar
    };
    res.cookie('rt', auth_1.createRefreshToken(user), Object.assign({ expires: new Date(Date.now() + auth_1.refreshTokenExpire) }, cookieOps));
    return res.json({ ok: 'true', accessToken: auth_1.createAccessToken(user), expire: auth_1.accessTokenExpire });
});
exports.refreshToken = refreshToken;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie('rt', '', cookieOps);
    return res.sendStatus(204);
});
exports.logout = logout;
function colorGenerator() {
    const letters = "0123456789ABCDEF";
    let colorString = '#';
    for (let i = 0; i < 6; i++) {
        colorString += letters[(Math.floor(Math.random() * 16))];
    }
    return colorString;
}
//# sourceMappingURL=authController.js.map