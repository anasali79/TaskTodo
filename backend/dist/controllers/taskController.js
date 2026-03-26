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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getTaskById = exports.createTask = exports.getTasks = void 0;
const Task_1 = __importStar(require("../models/Task"));
const User_1 = require("../models/User");
// @desc    Get all tasks for a user
// @route   GET /api/v1/tasks
// @access  Private
const getTasks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!(user === null || user === void 0 ? void 0 : user._id)) {
            res.status(401);
            return next(new Error('User not found'));
        }
        const tasks = user.role === User_1.UserRole.ADMIN
            ? yield Task_1.default.find({}).populate('user', 'name email')
            : yield Task_1.default.find({ user: user._id });
        return res.json(tasks);
    }
    catch (error) {
        return next(error);
    }
});
exports.getTasks = getTasks;
// @desc    Create a new task
// @route   POST /api/v1/tasks
// @access  Private
const createTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, status } = req.body;
    try {
        const user = req.user;
        if (!(user === null || user === void 0 ? void 0 : user._id)) {
            res.status(401);
            return next(new Error('User verification failed'));
        }
        const task = new Task_1.default({
            user: user._id,
            title,
            description,
            status: status !== null && status !== void 0 ? status : Task_1.TaskStatus.TODO,
        });
        const createdTask = yield task.save();
        return res.status(201).json(createdTask);
    }
    catch (error) {
        return next(error);
    }
});
exports.createTask = createTask;
// @desc    Get a task by ID
// @route   GET /api/v1/tasks/:id
// @access  Private
const getTaskById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const task = yield Task_1.default.findById(req.params.id).populate('user', 'name email');
        if (!task) {
            res.status(404);
            return next(new Error('Task not found'));
        }
        // Check ownership
        const isOwner = task.user.toString() === user._id.toString();
        const isAdmin = user.role === User_1.UserRole.ADMIN;
        if (!isOwner && !isAdmin) {
            res.status(403);
            return next(new Error('User not authorized to access this task'));
        }
        return res.json(task);
    }
    catch (error) {
        return next(error);
    }
});
exports.getTaskById = getTaskById;
// @desc    Update a task
// @route   PUT /api/v1/tasks/:id
// @access  Private
const updateTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { title, description, status } = req.body;
    try {
        const user = req.user;
        const task = yield Task_1.default.findById(req.params.id);
        if (!task) {
            res.status(404);
            return next(new Error('Task not found'));
        }
        // Check ownership
        const isOwner = task.user.toString() === user._id.toString();
        const isAdmin = user.role === User_1.UserRole.ADMIN;
        if (!isOwner && !isAdmin) {
            res.status(403);
            return next(new Error('User not authorized to update this task'));
        }
        task.title = title !== null && title !== void 0 ? title : task.title;
        task.description = description !== null && description !== void 0 ? description : task.description;
        task.status = (_a = status) !== null && _a !== void 0 ? _a : task.status;
        const updatedTask = yield task.save();
        return res.json(updatedTask);
    }
    catch (error) {
        return next(error);
    }
});
exports.updateTask = updateTask;
// @desc    Delete a task
// @route   DELETE /api/v1/tasks/:id
// @access  Private
const deleteTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const task = yield Task_1.default.findById(req.params.id);
        if (!task) {
            res.status(404);
            return next(new Error('Task not found'));
        }
        // Check ownership
        const isOwner = task.user.toString() === user._id.toString();
        const isAdmin = user.role === User_1.UserRole.ADMIN;
        if (!isOwner && !isAdmin) {
            res.status(403);
            return next(new Error('User not authorized to delete this task'));
        }
        yield task.deleteOne();
        return res.json({ message: 'Task removed' });
    }
    catch (error) {
        return next(error);
    }
});
exports.deleteTask = deleteTask;
