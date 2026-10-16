import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";

const pastaUploads = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../uploads");
const extensoesPermitidas = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif"
};

mkdirSync(pastaUploads, { recursive: true });

const armazenamento = multer.diskStorage({
    destination: pastaUploads,
    filename: (req, arquivo, callback) => {
        callback(null, `${randomUUID()}${extensoesPermitidas[arquivo.mimetype]}`);
    }
});

const upload = multer({
    storage: armazenamento,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, arquivo, callback) => {
        if (!extensoesPermitidas[arquivo.mimetype]) {
            return callback(new Error("Envie uma imagem JPG, PNG, WEBP ou GIF."));
        }
        callback(null, true);
    }
});

export const receberImagem = upload.single("imagem");