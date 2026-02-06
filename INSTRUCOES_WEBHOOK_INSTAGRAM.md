# 📸 Guia Completo: Webhook Instagram para Extração de Leads

Este guia ensina como configurar um workflow no n8n para extrair leads do Instagram com nome e telefone.

---

## 🎯 O que você vai conseguir fazer:

- Buscar perfis do Instagram por username ou hashtag
- Extrair seguidores/seguindo de um perfil
- Capturar nome, username e telefone (quando disponível na bio)
- Enviar os dados para sua interface de disparo

---

## 📋 Pré-requisitos:

1. **n8n instalado** (pode ser self-hosted ou n8n.cloud)
2. **Acesso à internet** para fazer requisições
3. **Conta Instagram** (opcional, para algumas funcionalidades)

---

## 🔧 Passo a Passo:

### 1️⃣ Criar Novo Workflow no n8n

1. Acesse seu n8n
2. Clique em **"New Workflow"**
3. Dê um nome: **"Instagram Lead Extractor"**

---

### 2️⃣ Adicionar Webhook (Gatilho)

1. Clique no **+** para adicionar um nó
2. Procure por **"Webhook"**
3. Selecione **"Webhook"** (não o "Webhook Response")
4. Configure:
   - **HTTP Method**: `POST`
   - **Path**: `instagram-leads` (ou qualquer nome que quiser)
   - **Response Mode**: `Last Node`
   - **Response Code**: `200`

5. **Copie a URL do Webhook** que aparece (algo como: `https://seu-n8n.com/webhook/instagram-leads`)
   - ⚠️ **Cole essa URL no campo "Webhook n8n" da sua interface!**

---

### 3️⃣ Adicionar Nó de Código (Extração)

1. Clique no **+** após o Webhook
2. Procure por **"Code"**
3. Selecione **"Code"**
4. Configure:
   - **Language**: `JavaScript`
   - **Mode**: `Run Once for All Items`

5. **Cole o código abaixo:**

```javascript
// Recebe a query da interface
const query = $input.first().json.query;

// IMPORTANTE: Este é um exemplo básico
// Para extração REAL do Instagram, você precisará:
// 1. Usar uma API de terceiros (ex: RapidAPI Instagram APIs)
// 2. Ou fazer web scraping (mais complexo e pode violar ToS do Instagram)
// 3. Ou usar a API oficial do Instagram (requer aprovação)

// EXEMPLO COM DADOS SIMULADOS (para teste):
const leadsSimulados = [
  {
    username: "joaosilva",
    name: "João Silva",
    phone: "11987654321",
    bio: "Empresário | WhatsApp: 11987654321"
  },
  {
    username: "mariasousa",
    name: "Maria Sousa", 
    phone: "21976543210",
    bio: "Contato: (21) 97654-3210"
  },
  {
    username: "pedrosantos",
    name: "Pedro Santos",
    phone: "85965432109",
    bio: "📞 85 96543-2109"
  }
];

// Para produção REAL, você faria algo como:
/*
const response = await $http.request({
  method: 'GET',
  url: 'https://api-instagram-terceiros.com/search',
  headers: {
    'X-RapidAPI-Key': 'SUA_CHAVE_AQUI'
  },
  qs: {
    username: query
  }
});

const leads = response.data.map(user => ({
  username: user.username,
  name: user.full_name,
  phone: extrairTelefone(user.biography),
  bio: user.biography
}));
*/

// Retorna os leads (simulados ou reais)
return leadsSimulados.map(lead => ({ json: lead }));
```

---

### 4️⃣ Adicionar Nó de Resposta

1. Clique no **+** após o Code
2. Procure por **"Respond to Webhook"**
3. Configure:
   - **Response Mode**: `Using 'Respond to Webhook' Node`
   - **Response Body**: `{{ $json }}`

---

### 5️⃣ Ativar o Workflow

1. Clique em **"Save"** (salvar)
2. Clique em **"Active"** (ativar) no canto superior direito
3. O workflow agora está rodando!

---

## 🚀 Como Usar na Interface:

1. **Copie a URL do Webhook** do n8n
2. **Cole no campo "Webhook n8n"** na aba Instagram da interface
3. Digite um username ou hashtag
4. Clique em **"BUSCAR LEADS REAIS"**
5. Os leads aparecerão na lista!

---

## 🔥 Opções para Extração REAL do Instagram:

### Opção 1: API de Terceiros (Recomendado)

**RapidAPI - Instagram APIs:**
- Acesse: https://rapidapi.com/hub
- Procure por "Instagram API"
- Escolha uma (ex: "Instagram Scraper API")
- Pegue sua API Key
- Use no código do n8n

**Exemplo de APIs populares:**
- Instagram Scraper API
- Instagram Data API
- Social Media API

### Opção 2: Web Scraping (Avançado)

Use bibliotecas como:
- Puppeteer (via n8n)
- Playwright
- Selenium

⚠️ **Atenção**: Web scraping pode violar os Termos de Serviço do Instagram!

### Opção 3: API Oficial do Instagram

- Requer aprovação do Meta
- Mais complexo de configurar
- Mais confiável e legal
- Acesse: https://developers.facebook.com/docs/instagram-api

---

## 📝 Código Completo para Extração REAL (Exemplo com RapidAPI):

```javascript
// Recebe dados da interface
const query = $input.first().json.query;

// Sua chave da RapidAPI
const RAPIDAPI_KEY = 'SUA_CHAVE_AQUI';

try {
  // Busca perfil no Instagram
  const profileResponse = await $http.request({
    method: 'GET',
    url: 'https://instagram-scraper-api2.p.rapidapi.com/v1/info',
    headers: {
      'X-RapidAPI-Key': RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'instagram-scraper-api2.p.rapidapi.com'
    },
    qs: {
      username_or_id_or_url: query
    }
  });

  const profile = profileResponse.data;

  // Busca seguidores
  const followersResponse = await $http.request({
    method: 'GET',
    url: 'https://instagram-scraper-api2.p.rapidapi.com/v1/followers',
    headers: {
      'X-RapidAPI-Key': RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'instagram-scraper-api2.p.rapidapi.com'
    },
    qs: {
      username_or_id_or_url: query,
      amount: 100 // Quantidade de seguidores
    }
  });

  // Função para extrair telefone da bio
  function extrairTelefone(texto) {
    if (!texto) return null;
    
    // Regex para encontrar telefones brasileiros
    const patterns = [
      /\(?\d{2}\)?\s?\d{4,5}-?\d{4}/g,
      /\d{10,11}/g,
      /whatsapp:?\s*\d+/gi
    ];
    
    for (let pattern of patterns) {
      const match = texto.match(pattern);
      if (match) {
        return match[0].replace(/\D/g, '');
      }
    }
    return null;
  }

  // Processa seguidores
  const leads = followersResponse.data.items.map(user => {
    const phone = extrairTelefone(user.biography);
    
    return {
      username: user.username,
      name: user.full_name || user.username,
      phone: phone,
      bio: user.biography || '',
      followers: user.follower_count
    };
  }).filter(lead => lead.phone); // Filtra apenas quem tem telefone

  return leads.map(lead => ({ json: lead }));

} catch (error) {
  throw new Error('Erro ao buscar dados do Instagram: ' + error.message);
}
```

---

## 🎨 Workflow Visual (Estrutura):

```
┌─────────────┐
│  Webhook    │ (Recebe query da interface)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Code     │ (Busca dados do Instagram)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Respond    │ (Retorna leads para interface)
└─────────────┘
```

---

## ✅ Checklist de Configuração:

- [ ] n8n instalado e rodando
- [ ] Workflow criado com nome "Instagram Lead Extractor"
- [ ] Nó Webhook configurado
- [ ] URL do Webhook copiada
- [ ] Nó Code com lógica de extração
- [ ] Nó Respond to Webhook adicionado
- [ ] Workflow salvo e ativado
- [ ] URL colada na interface de disparo
- [ ] Teste realizado com sucesso

---

## 🐛 Troubleshooting:

### Erro: "Webhook não responde"
- Verifique se o workflow está **Active**
- Confirme que a URL está correta
- Teste a URL diretamente no Postman/Insomnia

### Erro: "Nenhum lead encontrado"
- Verifique se a API está retornando dados
- Confira os logs do n8n
- Teste com um perfil público conhecido

### Erro: "API Key inválida"
- Verifique se copiou a chave corretamente
- Confirme se a assinatura da API está ativa
- Teste a chave diretamente na RapidAPI

---

## 💡 Dicas Importantes:

1. **Comece com dados simulados** para testar a integração
2. **Use APIs pagas** para produção (mais confiável)
3. **Respeite os limites** de requisições das APIs
4. **Filtre apenas perfis com telefone** para economizar créditos
5. **Armazene os leads** em um banco de dados para não perder

---

## 📞 Suporte:

Se tiver dúvidas sobre:
- **n8n**: https://community.n8n.io/
- **Instagram API**: https://developers.facebook.com/community/
- **RapidAPI**: https://rapidapi.com/support

---

**Criado para: Sistema de Disparo WhatsApp**  
**Versão: 1.0**  
**Data: Janeiro 2026**
