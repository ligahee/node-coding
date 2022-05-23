"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
require('dotenv').config();
const routes_1 = __importDefault(require("./routes"));
const app = express_1.default();
app.set('trust proxy', 1);
const allowedOrigins = ['http://localhost:3000'];
app.use(cors_1.default({
    origin: function (origin, callback) {
        //allow requests with no origin
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));
app.use(cookie_parser_1.default());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(routes_1.default);
app.get('/', (req, res) => {
    res.json('hello');
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server listening at localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map