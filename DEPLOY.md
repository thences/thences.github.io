# Deploy do portfolio

O portfolio esta configurado para GitHub Pages com dominio customizado.

## URLs

- Dominio final: `https://thences.com.br`
- URL GitHub Pages esperada: `https://thences.github.io/`

## Como publica

O workflow `.github/workflows/deploy.yml` roda automaticamente em cada push para `main`:

1. instala dependencias com `npm ci`;
2. roda `npm run lint`;
3. roda `npm run typecheck`;
4. gera o build com `npm run build`;
5. publica a pasta `dist` no GitHub Pages.

O arquivo `public/CNAME` define `thences.com.br` como dominio customizado do Pages.

## DNS necessario

No provedor do dominio, configure o dominio raiz `thences.com.br` com estes registros `A`:

```text
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

Para `www.thences.com.br`, configure um `CNAME` apontando para:

```text
thences.github.io
```
