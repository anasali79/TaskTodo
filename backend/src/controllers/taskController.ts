import { Request, Response, NextFunction } from 'express';
import Task, { TaskStatus } from '../models/Task';
import { IUser, UserRole } from '../models/User';

// @desc    Get all tasks for a user
// @route   GET /api/v1/tasks
// @access  Private
export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as IUser;
    if (!user?._id) {
      res.status(401);
      return next(new Error('User not found'));
    }

    const tasks = user.role === UserRole.ADMIN 
      ? await Task.find({}).populate('user', 'name email') 
      : await Task.find({ user: user._id });
      
    return res.json(tasks);
  } catch (error) {
    return next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/v1/tasks
// @access  Private
export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  const { title, description, status } = req.body;

  try {
    const user = req.user as IUser;
    if (!user?._id) {
      res.status(401);
      return next(new Error('User verification failed'));
    }

    const task = new Task({
      user: user._id,
      title,
      description,
      status: status ?? TaskStatus.TODO,
    });

    const createdTask = await task.save();
    return res.status(201).json(createdTask);
  } catch (error) {
    return next(error);
  }
};

// @desc    Get a task by ID
// @route   GET /api/v1/tasks/:id
// @access  Private
export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as IUser;
    const task = await Task.findById(req.params.id).populate('user', 'name email');

    if (!task) {
      res.status(404);
      return next(new Error('Task not found'));
    }

    // Check ownership
    const isOwner = task.user.toString() === user._id.toString();
    const isAdmin = user.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      res.status(403);
      return next(new Error('User not authorized to access this task'));
    }

    return res.json(task);
  } catch (error) {
    return next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/v1/tasks/:id
// @access  Private
export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  const { title, description, status } = req.body;

  try {
    const user = req.user as IUser;
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      return next(new Error('Task not found'));
    }

    // Check ownership
    const isOwner = task.user.toString() === user._id.toString();
    const isAdmin = user.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      res.status(403);
      return next(new Error('User not authorized to update this task'));
    }

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.status = (status as TaskStatus) ?? task.status;

    const updatedTask = await task.save();
    return res.json(updatedTask);
  } catch (error) {
    return next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/v1/tasks/:id
// @access  Private
export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as IUser;
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      return next(new Error('Task not found'));
    }

    // Check ownership
    const isOwner = task.user.toString() === user._id.toString();
    const isAdmin = user.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      res.status(403);
      return next(new Error('User not authorized to delete this task'));
    }

    await task.deleteOne();
    return res.json({ message: 'Task removed' });
  } catch (error) {
    return next(error);
  }
};
