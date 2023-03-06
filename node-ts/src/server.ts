import {config} from "dotenv";
config({ path: '../.env' });
import { Logger, ILogObj } from "tslog";
const log: Logger<ILogObj> = new Logger();
import app from "./app";

const {
    PORT,
} = process.env

app.listen(Number(PORT) ?? 5000, () => {
    log.info(`Server is running on port ${PORT}`)
})