import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import "dotenv/config";
import brinquedosRoutes from "./routes/brinquedosRoutes.js";
import corsMiddleware from "./middlewares/corsMiddleware.js";
import { testarConexao } from "./database/conexao.js";

const app = express();
const PORT = process.env.PORT || 3000;
const pastaBackend = path.dirname(fileURLToPath(import.meta.url));
app.use(corsMiddleware);
app.use(express.json());
app.use("/uploads", express.static(path.join(pastaBackend, "uploads")));
app.use("/brinquedos", brinquedosRoutes);
app.get("/", (req, res) => {
    res.status(200).json({ mensagem: "API da Loja de Brinquedos funcionando!" });
});

async function iniciarServidor() {
    try {
        await testarConexao();
        app.listen(PORT, function(){
            console.log("servidor rodando em http://localhost:" + PORT);
            //console.log(`servidor rodando em http://localhost:${PORT}`);
        });
    }catch(erro){
        console.log("nao foi possivel iniciar o servidor");
        console.log(erro.message);
    
    }
}
iniciarServidor();
