PIXELIA 2.2 — HUGGING FACE + MERCADO PAGO

ESTA VERSÃO USA server.js NA RAIZ. NÃO USA index.js.
É o nome de entrada que aparece na tela Source do seu projeto Vercel.

ARQUIVOS:
README.txt
app.js
index.html
package.json
server.js
style.css
vercel.json

SUBSTITUIÇÃO:
1. Extraia este ZIP.
2. No GitHub, substitua os arquivos existentes pelos arquivos deste ZIP.
3. É MUITO IMPORTANTE substituir o conteúdo de server.js pelo server.js deste ZIP.
4. Não deixe um server.js antigo. Não crie index.js adicional.
5. Mantenha app.js, index.html, style.css, package.json e vercel.json na raiz.
6. Faça commit na branch main.
7. Aguarde o deploy automático da Vercel.

VARIÁVEIS:
- HF_TOKEN: token Hugging Face com permissão Inference.
- MERCADOPAGO_ACCESS_TOKEN: Access Token do Mercado Pago.
Remova OPENAI_API_KEY e OPENAI_IMAGE_MODEL se ainda existirem.

VERIFICAÇÃO:
Após o deploy, abra /api/version. Deve retornar:
{"version":"pixelia-hf-2.2","provider":"huggingface"}

SEGURANÇA:
Tokens são lidos no servidor por process.env e não ficam no HTML ou app.js.

NOTAS:
Hugging Face Inference Providers podem ter limites e custos; não são ilimitados gratuitos.
A integração de pagamento Pix foi mantida, incluindo o campo de e-mail já existente.
