import express from 'express';

const router = express.Router();

let routes = (app) => {
    router.post("login", ... );
    router.post("register", ... );
    
    app.use(router);
};

export default routes;