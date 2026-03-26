"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.authUser = exports.registerUser = void 0;
const User_1 = __importStar(require("../models/User"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
// @desc    Register a new user
// @route   POST /api/v1/users
// @access  Public
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role } = req.body;
    try {
        const userExists = yield User_1.default.findOne({ email });
        if (userExists) {
            res.status(400);
            return next(new Error('User already exists'));
        }
        const user = yield User_1.default.create({
            name,
            email,
            password,
            role: role !== null && role !== void 0 ? role : User_1.UserRole.USER,
        });
        if (user) {
            return res.status(201).json({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: (0, generateToken_1.default)(user._id.toString()),
            });
        }
        else {
            res.status(400);
            return next(new Error('Invalid user data'));
        }
    }
    catch (error) {
        return next(error);
    }
});
exports.registerUser = registerUser;
// @desc    Authenticate user & get token
// @route   POST /api/v1/users/login
// @access  Public
const authUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield User_1.default.findOne({ email });
        if (user && (yield user.matchPassword(password))) {
            return res.json({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: (0, generateToken_1.default)(user._id.toString()),
            });
        }
        else {
            res.status(401);
            return next(new Error('Invalid email or password'));
        }
    }
    catch (error) {
        return next(error);
    }
});
exports.authUser = authUser;
