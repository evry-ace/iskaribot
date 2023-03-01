import express, { Application } from "express";
import { Logger, ILogObj } from "tslog";
const log: Logger<ILogObj> = new Logger();

import { router as workplaceRoutes } from "./routes/workplace.routes";

const app: Application = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Log invocation
app.use(({ip, method, path,  query,body},res,next) => {
    const _query = Object.keys(query).length !== 0 ? 'query:'+JSON.stringify(query) : ''
    const _body = Object.keys(body).length !== 0 ? 'body:'+JSON.stringify(body) : ''
    log.debug(`[${ip}] ${method} ${path} ${_query} ${_body}`)
    next()
})

app.use("/workplace", workplaceRoutes);

export default app;