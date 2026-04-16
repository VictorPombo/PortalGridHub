import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Sobre o Driver News - Transparência",
  description: "Entenda nosso modelo de publicação, inteligência artificial e proteção autoral."
};

export default function SobrePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16 min-h-screen">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Voltar ao Início
        </Link>
      </div>

      <article className="prose prose-invert prose-lg max-w-none prose-h1:text-4xl prose-h1:font-black prose-h2:text-red-500 prose-h2:mt-12 prose-a:text-red-500 hover:prose-a:text-red-400">
        <h1>Sobre o Driver News</h1>
        <p>
          O Driver News é uma plataforma de conteúdo sobre automobilismo operada pela NextHub. Nosso modelo combina duas fontes de conteúdo, claramente identificadas:
        </p>

        <h2>Matérias Exclusivas</h2>
        <p>
          São produzidas por pilotos e profissionais do motorsport que assinam nossos planos. O fluxo de publicação é:
        </p>
        <ol>
          <li>O autor preenche um formulário estruturado com os fatos que deseja comunicar;</li>
          <li>Nossa plataforma utiliza inteligência artificial para reestruturar o texto em formato jornalístico, sem inventar informações;</li>
          <li>O autor revisa, edita se necessário e aprova a versão final;</li>
          <li>Antes de publicar, o autor assina três declarações obrigatórias de veracidade, responsabilidade e isenção do Driver News.</li>
        </ol>
        <p>
          Essas matérias ficam marcadas com o selo "EXCLUSIVO" e o nome do autor aparece com destaque.
        </p>

        <h2>Matérias Agregadas</h2>
        <p>
          Indexamos manchetes, imagens de prévia e links de notícias publicadas em portais parceiros de automobilismo. Ao clicar em qualquer matéria agregada, você é redirecionado diretamente ao portal de origem, que é o único responsável pelo conteúdo completo. O Driver News não reproduz textos integrais e sempre credita visivelmente a fonte.
        </p>

        <h2>Como reportar conteúdo</h2>
        <p>
          Se você é portal de notícias, fotógrafo, piloto ou qualquer pessoa que identificou conteúdo publicado de forma indevida, acesse nossa <Link href="/remocao.html">Política de Remoção</Link> ou envie e-mail para:
        </p>
        <p><strong>contato.drivernews@proton.me</strong></p>
        <p>Respondemos em até 48 horas úteis.</p>

        <h2>Como funciona a IA</h2>
        <p>
          Utilizamos modelos de linguagem de última geração para auxiliar a redação das matérias exclusivas. A IA recebe apenas as informações fornecidas pelo autor e é instruída a não inventar fatos, datas, nomes ou números. Guardamos registros completos de cada chamada da IA por 5 anos para fins de auditoria.
        </p>

        <h2>Dados e privacidade</h2>
        <p>
          Seguimos a LGPD (Lei Geral de Proteção de Dados). Consulte nossa <Link href="/politica.html">Política de Privacidade</Link> para detalhes.
        </p>

        <h2 id="contato">Contato</h2>
        <ul>
          <li><strong>E-mail:</strong> contato.drivernews@proton.me</li>
          <li><strong>Telefone:</strong> (11) 97637-7682</li>
          <li><strong>Endereço:</strong> Rua dos Ranúnculos, 357, São Paulo/SP</li>
          <li><strong>CNPJ:</strong> 65.934.326/0001-31 (NextHub)</li>
        </ul>
      </article>
    </main>
  );
}
