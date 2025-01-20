import Project from "../models/project.model.js";
import { errorHandler } from "../utils/error.js";

export const createProject = async (req, res, next) => {
    try {
        if(req.body.userId && req.body.userId !== req.user.id)
        {
            return next(
                errorHandler(403, 'You are not allowed to create this project details.')
            );
        }
        const newProject = new Project({ 
             ...req.body,
             userId: req.user.id,
            });

        await newProject.save();
        res.status(200).json(newProject);
    } catch (error) {
        next(error);
    }
};


export const getProjectDetail = async (req, res, next) => {
    try {
      const projects = await Project.find({ userId: req.params.userId }).sort({
        createdAt: -1,
      });
      res.status(200).json(projects);
    } catch (error) {
      next(error);
    }
  };
