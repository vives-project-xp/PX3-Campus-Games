import express from 'express';

const router = express.Router();

let routes = (app) => {
    router.post("login", (req, res) => {
        // handle login
    });
    router.post("register", (req, res) => {
        // handle register
    });
    
    app.use(router);
};

export default routes;