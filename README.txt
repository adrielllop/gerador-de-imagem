PIXELIA 2.0 — HUGGING FACE + PIX MERCADO PAGO

ARQUIVOS:
Todos os 7 arquivos ficam juntos na raiz, sem subpastas.

VARIÁVEIS DA VERCEL:
1. HF_TOKEN = seu token Fine-grained do Hugging Face, com a permissão Inference.
2. MERCADOPAGO_ACCESS_TOKEN = seu Access Token do Mercado Pago (manter o mesmo).

REMOVER:
- OPENAI_API_KEY (não é mais usada)
- OPENAI_IMAGE_MODEL (não é mais usada)

PUBLICAÇÃO:
1. Extraia o ZIP.
2. No GitHub, substitua os arquivos antigos pelos 7 arquivos desta versão.
3. Exclua também pnpm-lock.yaml e package-lock.json antigos, se existirem, para evitar lockfile desatualizado.
4. Faça commit das alterações.
5. Na Vercel, configure HF_TOKEN e mantenha MERCADOPAGO_ACCESS_TOKEN.
6. Faça Redeploy com Clear Build Cache, se disponível.

GERAÇÃO:
- O servidor usa @huggingface/inference e o modelo black-forest-labs/FLUX.1-dev.
- O token fica somente no servidor, nunca no navegador.
- Os formatos quadrado/retrato/paisagem são enviados com dimensões adequadas.
- Um crédito só é descontado no navegador quando a imagem é retornada com sucesso.

PAGAMENTOS:
- A integração Pix do Mercado Pago foi mantida como estava nesta versão.
- A variável MERCADOPAGO_ACCESS_TOKEN continua necessária.
- A interface de recarga ainda pede e-mail do pagador, pois a implementação atual da cobrança Pix usa esse campo.

LIMITES E CUSTOS:
O token Hugging Face não significa geração ilimitada gratuita. Inference Providers podem ter créditos gratuitos limitados e cobrar conforme o provedor/modelo. Verifique o saldo e a política de uso na sua conta Hugging Face antes de vender créditos aos clientes.

SEGURANÇA:
Nunca coloque HF_TOKEN ou MERCADOPAGO_ACCESS_TOKEN no app.js, index.html ou em arquivos públicos. Cadastre os tokens somente em Environment Variables da Vercel.
