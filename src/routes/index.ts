import express, { Response, Request } from "express";

const router = express.Router();

/* GET home page. */
router.get("/", (req: Request, res: Response): void => {
  res.render("index", {
    title: "Example Microservice",
    info: "This is the example microservice.",
  });
});

export { router };
