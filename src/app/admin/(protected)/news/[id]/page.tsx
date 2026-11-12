import { notFound } from "next/navigation";
import { getAllNews } from "@/lib/content";
import NewsForm from "@/components/admin/news-form";

export default async function EditNews({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const items = await getAllNews();
  const item = items.find((n) => n.id === id);
  if (!item) notFound();

  return (
    <div>
      <h1 className="a-title">Modifier l&apos;article</h1>
      <div className="mt-8"><NewsForm item={item} /></div>
    </div>
  );
}
