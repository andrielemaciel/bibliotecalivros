import express from "express";
import {
    listarBrinquedos, buscarBrinquedoPorId, cadastrarBrinquedo,
    atualizarBrinquedo, excluirBrinquedo
} from "../controllers/brinquedosController.js";
import { receberImagem } from "../middlewares/uploadImagem.js";

const router = express.Router();
function tratarUploadImagem(req, res, next) {
    receberImagem(req, res, (erro) => {
        if (erro) {
            const mensagem = erro.code === "LIMIT_FILE_SIZE"
                ? "A imagem deve ter no máximo 5 MB."
                : erro.message;
            return res.status(400).json({ mensagem });
        }
        next();
    });
}

router.get("/", listarBrinquedos);
router.post("/", tratarUploadImagem, cadastrarBrinquedo);
router.get("/:id", buscarBrinquedoPorId);
router.put("/:id", tratarUploadImagem, atualizarBrinquedo);
router.delete("/:id", excluirBrinquedo);
export default router;
