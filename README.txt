PIXELIA 2.1 — HUGGING FACE + PIX MERCADO PAGO

Todos os 7 arquivos ficam juntos na raiz, sem subpastas.

IMPORTANTE: esta versão usa index.js como entrada Express da Vercel. Não existe server.js nesta versão.

VARIÁVEIS DA VERCEL:
1. HF_TOKEN = token Hugging Face Fine-grained com permissão Inference.
2. MERCADOPAGO_ACCESS_TOKEN = Access Token Mercado Pago.

REMOVA:
- OPENAI_API_KEY
- OPENAI_IMAGE_MODEL

ATUALIZAÇÃO:
1. Extraia este ZIP.
2. No GitHub, substitua os arquivos antigos por TODOS os arquivos deste ZIP.
3. Apague server.js antigo, se ainda existir no repositório.
4. Apague pnpm-lock.yaml e package-lock.json antigos, se existirem.
5. Confirme que index.js está na raiz, no mesmo nível de package.json.
6. Faça commit.
7. Na Vercel, confirme Root Directory = ./ (raiz do repositório).
8. Configure HF_TOKEN e mantenha MERCADOPAGO_ACCESS_TOKEN.
9. Faça Redeploy com Clear Build Cache.
10. Depois do deploy, abra https://SEU-SITE/api/version. Deve aparecer version pixelia-hf-2.1 e provider huggingface.

GERAÇÃO:
Usa @huggingface/inference e black-forest-labs/FLUX.1-dev. Token somente no servidor. Créditos locais são descontados somente quando a geração retorna imagem.

LIMITES:
Hugging Face Inference Providers não é ilimitado gratuito; pode haver limites/créditos e cobranças.

PAGAMENTOS:
A integração Pix do Mercado Pago foi mantida. O formulário ainda pede e-mail porque a criação Pix desta implementação envia payer.email.

SEGURANÇA:
Não coloque HF_TOKEN ou MERCADOPAGO_ACCESS_TOKEN em HTML/JS. Cadastre apenas nas Environment Variables da Vercel.
