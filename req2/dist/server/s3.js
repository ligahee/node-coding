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
exports.generateUploadUrl = void 0;
const s3_1 = __importDefault(require("aws-sdk/clients/s3"));
const s3 = new s3_1.default({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESSIDKEY,
    secretAccessKey: process.env.AWS_SECRETACCESSKEY,
    signatureVersion: 'v4'
});
const generateUploadUrl = (photoName) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        Bucket: 'jiayili7413',
        Key: photoName,
    };
    const url = yield s3.getSignedUrlPromise('putObject', params);
    return url;
});
exports.generateUploadUrl = generateUploadUrl;
//# sourceMappingURL=s3.js.map