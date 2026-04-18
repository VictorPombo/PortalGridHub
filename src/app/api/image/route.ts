import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '../../../lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const type = searchParams.get('type') || 'article'; // 'article' ou 'pilot'

  if (!id) {
    return new NextResponse('ID obrigatório', { status: 400 });
  }

  try {
    let b64str = null;

    if (type === 'article') {
      const { data } = await supabase.from('articles').select('img').eq('id', id).single();
      if (data && data.img && data.img.startsWith('data:image/')) {
        b64str = data.img;
      } else if (data && data.img && data.img.startsWith('http')) {
        return NextResponse.redirect(data.img); // Se já for um arquivo real, apenas redirecione.
      }
    } else if (type === 'pilot') {
      const { data } = await supabase.from('users').select('avatar_url, cover_url').eq('id', id).single();
      const img = data?.cover_url || data?.avatar_url;
      if (img && img.startsWith('data:image/')) {
        b64str = img;
      } else if (img && img.startsWith('http')) {
        return NextResponse.redirect(img);
      }
    }

    if (!b64str) {
      // Retornar fallback genérico
      return NextResponse.redirect('https://www.drivernews.com.br/images/share.jpg');
    }

    // Isolar os bits reais de Base64
    const matches = b64str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return new NextResponse('Formato inválido', { status: 400 });
    }

    const mimeType = matches[1];
    const imageBuffer = Buffer.from(matches[2], 'base64');

    // A mágica: Devolver a imagem raw como se fosse um arquivo de verdade
    // Assim o WhatsApp, iMessage e Telegram conseguem baixar a imagem diretamente.
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=86400'
      }
    });

  } catch (error) {
    console.error('API /api/image error:', error);
    return NextResponse.redirect('https://www.drivernews.com.br/images/share.jpg');
  }
}
