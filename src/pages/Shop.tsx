import { useParams } from "react-router-dom";
import { SECTIONS } from "../data/navigation";

export default function Shop() {
  const { gender, category } = useParams();
  const section = SECTIONS.find((s) => s.slug === gender);
  const cat = section?.categories.find((c) => c.slug === category);
  const title = [section?.label ?? "All products", cat?.label].filter(Boolean).join(" · ");

  return (
    <section className="container placeholder">
      <h1 className="page-title">{title}</h1>
      <p>Products, filters and the grid view are coming in Phase 2.</p>
    </section>
  );
}