import express, {Router} from 'express';
import fs from 'fs';

const router = Router();

const PATH = __dirname;

const removeExtension = (fileName: string): string => {
    return fileName.split(".").shift() || '';
}

fs.readdirSync(PATH).filter((fileName: string) => {
    const name = removeExtension(fileName);
    if(name !== "index") {
        router.use(`/${name}`, require(`./${fileName}`).default)
    }
});

export default router;