const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../database');

/**
 * POST /api/usuarios/cadastro
 * Tarefa: TASK-005
 * User Story: Cadastro de Usuário
 * 
 * Critérios implementados:
 * - Validação de domínio institucional
 * - Regras de complexidade de senha
 * - Prevenção de emails duplicados
 * - Hash seguro de senha
 */
router.post('/cadastro', async (req, res) => {
    const { nomeCompleto, email, curso, semestre, senha } = req.body;

    // 1. Validar campos obrigatórios
    if (!nomeCompleto || !email || !senha) {
        return res.status(400).json({ 
            erro: 'Nome completo, email e senha são obrigatórios',
            camposFaltantes: {
                nomeCompleto: !nomeCompleto,
                email: !email,
                senha: !senha
            }
        });
    }

    // 2. Validar domínio do email institucional
    const dominioValido = '@universidade.edu.br';
    if (!email.endsWith(dominioValido)) {
        return res.status(400).json({ 
            erro: `Email deve ser do domínio institucional ${dominioValido}`,
            emailInformado: email
        });
    }

    // 3. Validar complexidade da senha
    const regexSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!regexSenha.test(senha)) {
        return res.status(400).json({ 
            erro: 'Senha deve ter no mínimo 8 caracteres, incluindo maiúscula, minúscula e número',
            requisitos: {
                tamanhoMinimo: 8,
                maiuscula: true,
                minuscula: true,
                numero: true
            }
        });
    }

    try {
        // 4. Verificar se email já existe
        const usuarioExistente = await db.get(
            'SELECT id FROM usuarios WHERE email = ?',
            [email]
        );

        if (usuarioExistente) {
            return res.status(409).json({ 
                erro: 'Este email já está cadastrado no sistema'
            });
        }

        // 5. Criar hash da senha
        const saltRounds = 10;
        const senhaHash = await bcrypt.hash(senha, saltRounds);

        // 6. Inserir usuário no banco
        const resultado = await db.run(
            `INSERT INTO usuarios (nome, email, curso, semestre, senha, criado_em) 
             VALUES (?, ?, ?, ?, ?, datetime('now'))`,
            [nomeCompleto, email, curso, semestre, senhaHash]
        );

        // 7. TODO: Implementar envio de email de confirmação
        // await enviarEmailConfirmacao(email, nomeCompleto);

        res.status(201).json({ 
            mensagem: 'Usuário cadastrado com sucesso!',
            usuarioId: resultado.lastID,
            proximoPasso: 'Verifique seu email para confirmar o cadastro'
        });

    } catch (erro) {
        console.error('Erro ao cadastrar usuário:', erro);
        res.status(500).json({ 
            erro: 'Erro interno ao processar cadastro',
            suporte: 'Entre em contato com suporte@connexa.com'
        });
    }
});

module.exports = router;