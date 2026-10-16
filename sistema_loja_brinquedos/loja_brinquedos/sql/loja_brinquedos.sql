CREATE DATABASE loja_brinquedos;
USE loja_brinquedos;

CREATE TABLE brinquedos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    categoria VARCHAR(60) NOT NULL,
    faixa_etaria VARCHAR(30) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    imagem_url VARCHAR(2048) NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dados iniciais de exemplo
INSERT INTO brinquedos (nome, categoria, faixa_etaria, preco) VALUES
('Urso de pelúcia', 'Pelúcias', '3 a 5 anos', 59.90),
('Blocos de montar coloridos', 'Blocos de montar', '3 a 5 anos', 89.90),
('Boneca com acessórios', 'Bonecas e bonecos', '6 a 8 anos', 74.50),
('Carrinho de corrida', 'Veículos', '3 a 5 anos', 24.99),
('Quebra-cabeça de animais', 'Educativos', '6 a 8 anos', 39.90),
('Jogo de tabuleiro', 'Jogos de tabuleiro', '9 a 12 anos', 99.90),
('Kit de pintura infantil', 'Educativos', '6 a 8 anos', 32.50),
('Bola infantil', 'Esportes', '3 a 5 anos', 29.90),
('Robô eletrônico', 'Eletrônicos', '9 a 12 anos', 149.90),
('Caminhão de brinquedo', 'Veículos', '3 a 5 anos', 44.90);

SELECT * FROM brinquedos;
