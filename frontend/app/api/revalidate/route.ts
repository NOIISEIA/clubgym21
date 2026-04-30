import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/revalidate?secret=REVALIDATE_SECRET
 *
 * Body JSON attendu (optionnel) :
 *   { "type": "post" | "page", "slug": "mon-slug" }
 *
 * Si le body est absent, tout le site est revalidé.
 *
 * Configurer dans WordPress via un hook sur save_post :
 *   wp_remote_post(NEXT_URL . '/api/revalidate?secret=' . SECRET, [
 *     'body' => json_encode(['type' => 'page', 'slug' => $post->post_name]),
 *     'headers' => ['Content-Type' => 'application/json'],
 *   ]);
 */
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");

  if (!process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { message: "REVALIDATE_SECRET non configuré sur le serveur." },
      { status: 500 }
    );
  }

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { message: "Token de revalidation invalide." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { type, slug } = body as { type?: string; slug?: string };

    if (type === "post" && slug) {
      revalidatePath(`/blog/${slug}`);
      revalidatePath("/blog");
      revalidatePath("/", "layout");
    } else if (type === "page" && slug) {
      revalidatePath(`/${slug}`);
      revalidatePath("/");
      revalidatePath("/", "layout");
    } else {
      // Revalidation complète du site
      revalidatePath("/", "layout");
    }

    return NextResponse.json({
      revalidated: true,
      type: type ?? "full",
      slug: slug ?? null,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[revalidate]", err);
    return NextResponse.json(
      { message: "Erreur lors de la revalidation." },
      { status: 500 }
    );
  }
}
