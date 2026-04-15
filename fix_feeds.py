import re

with open('src/app/api/news/route.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Ache as definicoes de FEEDS_BRASIL
# Meu regex do patch anterior provavelmente adicionou um const FEEDS_BRASIL depois de FEEDS_MUNDIAL,
# preservando o antigo FEEDS_BRASIL mais embaixo.
# Vamos substituir todas as definicoes FEEDS_BRASIL pelo que deve ser correto:

feedi = r"""const FEEDS_BRASIL = [
  { url: "https://br.motorsport.com/rss/f1/news/", name: "Motorsport BR", cat: "F1" },
  { url: "https://br.motorsport.com/rss/motogp/news/", name: "Motorsport BR", cat: "MotoGP" },
  { url: "https://br.motorsport.com/rss/stockcar-br/news/", name: "Motorsport BR", cat: "Stock Car" },
  { url: "https://br.motorsport.com/rss/wec/news/", name: "Motorsport BR", cat: "Endurance" },
  { url: "https://br.motorsport.com/rss/all/news/", name: "Motorsport BR All", cat: "Geral" } // Para não ficar sem
];"""

text = text.replace(feedi, "")

with open('src/app/api/news/route.ts', 'w', encoding='utf-8') as f:
    f.write(text)

