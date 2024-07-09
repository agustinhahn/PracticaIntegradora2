import Controllers from "./class.controller.js";
import UserService from '../services/user.services.js';
import { createResponse } from "../utils.js";

const userService = new UserService();

export default class UserController extends Controllers {
  constructor() {
    super(userService)
  }

  register = async (req, res, next) => {
    try {
      res.json({
        msg:"register test OK",
        session: req.session
      })
    } catch (error) {
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const {user, token} = await this.service.login(req.body);
      res.header('Authorization', token);
      !token ? createResponse(res, 404, token) : createResponse(res, 200, token);
    } catch (error) {
      next(error);
    }
  };

  infoSession = async (req, res, next) => {
    try {
      res.json({
        session: req.session,
        sessionId: req.sessionID,
        cookies: req.cookies,
      });
    } catch (error) {
      next(error)
    }

  };

  profile = (req, res, next) => {
    try {
      if (req.user) {
        const { first_name, last_name, email, role } = req.user;
        createResponse(res, 200, {
          first_name, last_name, email, role
        })
      } else createResponse(res, 403, { msg: 'Unhautorized' })
    } catch (error) {
      next(error);
    }
  };

  githubResponse = async(req,res,next)=>{
    try {
      console.log(req.user)
      const { first_name, last_name, email, role } = req.user;
      res.json({
        msg: 'LOGIN WITH GITHUB OK!',
        user: {
          first_name,
          last_name,
          email,
          role
        }
      })
    } catch (error) {
      next(error)
    }
  }

  logout = (req,res,next)=>{
    try {
      console.log(req.session)
      req.session.destroy()
      res.send("session destroy")
    } catch (error) {
      next(error)
    }
  }

};