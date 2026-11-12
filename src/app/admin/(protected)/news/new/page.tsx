import NewsForm from "@/components/admin/news-form";

export default function NewNews() {
  return (
    <div>
      <h1 className="a-title">Nouvel article</h1>
      <div className="mt-8"><NewsForm /></div>
    </div>
  );
}
