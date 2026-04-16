import { NextResponse } from "next/server";
import sharp from "sharp";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const urlParams = searchParams.get("url");

  if (!urlParams) {
    return new NextResponse("Falta o parâmetro ?url=", { status: 400 });
  }

  try {
    const response = await fetch(urlParams, {
      headers: {
        "User-Agent": "Driver News-News-Bot/1.0 (+https://drivernews.com.br/bot)",
        "Accept": "image/*",
      },
    });

    if (!response.ok) {
      throw new Error(`Falha ao baixar imagem: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Usa sharp pra redimensionar e limpar EXIF
    const processedBuffer = await sharp(buffer)
      .resize(800, null, {
        withoutEnlargement: true,
      })
      .webp({ quality: 80 }) // Formato webp para performance
      .toBuffer();

    return new NextResponse(processedBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "image/webp",
        // Cache poderoso para aliviar CPU
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200",
      },
    });

  } catch (err: any) {
    console.error("Erro no Proxy:", err.message);
    // Em caso de erro, apenas redireciona para a url pura 
    // ou mostra um pixel transparente
    return NextResponse.redirect(urlParams);
  }
}
