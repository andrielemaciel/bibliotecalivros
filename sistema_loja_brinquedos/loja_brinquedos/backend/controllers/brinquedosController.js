import { pool } from "../database/conexao.js";

async function listarBrinquedos(req, res) {
    try {
        const [brinquedos] = await pool.query("SELECT * FROM brinquedos ORDER BY id");
        res.json(brinquedos);
    } catch (erro) {
        console.error("Erro ao buscar brinquedos:", erro);
        res.status(500).json({ mensagem: "Erro ao buscar brinquedos" });
    }
}

async function buscarBrinquedoPorId(req, res) {
    try {
        const [brinquedos] = await pool.query("SELECT * FROM brinquedos WHERE id = ?", [req.params.id]);
        if (brinquedos.length === 0) {
            return res.status(404).json({ mensagem: "Brinquedo não encontrado" });
        }
        res.status(200).json(brinquedos[0]);
    } catch (erro) {
        console.error("Erro ao buscar brinquedo:", erro);
        res.status(500).json({ mensagem: "Erro ao buscar brinquedo" });
    }
}

async function cadastrarBrinquedo(req, res) {
    try {
        const { nome, categoria, faixa_etaria, preco } = req.body;
        if (!nome || !categoria || !faixa_etaria || preco === undefined || preco === "") {
            return res.status(400).json({ mensagem: "Preencha todos os campos" });
        }
        const valor = Number(preco);
        if (!Number.isFinite(valor) || valor < 0) {
            return res.status(400).json({ mensagem: "O preço deve ser um número válido e não negativo" });
        }
        const imagemUrl = req.file ? `/uploads/${req.file.filename}` : null;
        const [resultado] = await pool.query(
            "INSERT INTO brinquedos (nome, categoria, faixa_etaria, preco, imagem_url) VALUES (?, ?, ?, ?, ?)",
            [nome.trim(), categoria, faixa_etaria, valor, imagemUrl]
        );
        res.status(201).json({ mensagem: "Brinquedo cadastrado com sucesso", id: resultado.insertId });
    } catch (erro) {
        console.error("Erro ao cadastrar brinquedo:", erro);
        res.status(500).json({ mensagem: "Erro ao cadastrar brinquedo" });
    }
}

async function atualizarBrinquedo(req, res) {
    try {
        const { nome, categoria, faixa_etaria, preco } = req.body;
        if (!nome || !categoria || !faixa_etaria || preco === undefined || preco === "") {
            return res.status(400).json({ mensagem: "Preencha todos os campos" });
        }
        const valor = Number(preco);
        if (!Number.isFinite(valor) || valor < 0) {
            return res.status(400).json({ mensagem: "O preço deve ser um número válido e não negativo" });
        }
        const imagemUrl = req.file ? `/uploads/${req.file.filename}` : null;
        const [resultado] = await pool.query(
            "UPDATE brinquedos SET nome = ?, categoria = ?, faixa_etaria = ?, preco = ?, imagem_url = COALESCE(?, imagem_url) WHERE id = ?",
            [nome.trim(), categoria, faixa_etaria, valor, imagemUrl, req.params.id]
        );
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Brinquedo não encontrado" });
        }
        res.json({ mensagem: "Brinquedo atualizado com sucesso" });
    } catch (erro) {
        console.error("Erro ao atualizar brinquedo:", erro);
        res.status(500).json({ mensagem: "Erro ao atualizar brinquedo" });
    }
}

async function excluirBrinquedo(req, res) {
    try {
        const [resultado] = await pool.query("DELETE FROM brinquedos WHERE id = ?", [req.params.id]);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Brinquedo não encontrado" });
        }
        res.json({ mensagem: "Brinquedo excluído com sucesso" });
    } catch (erro) {
        console.error("Erro ao excluir brinquedo:", erro);
        res.status(500).json({ mensagem: "Erro ao excluir brinquedo" });
    }
}

export { listarBrinquedos, buscarBrinquedoPorId, cadastrarBrinquedo, atualizarBrinquedo, excluirBrinquedo };
