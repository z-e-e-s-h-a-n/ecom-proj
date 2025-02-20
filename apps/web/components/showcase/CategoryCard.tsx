import Link from "next/link";

function CategoryCard({ name }: ICategory) {
  return (
    <Link href={"/"} className="flex-center h-[145px] rounded border">
      <div className="flex-center flex-col gap-4">
        {/* <Icon className="size-10" /> */}
        <span className="subtitle-1">{name}</span>
      </div>
    </Link>
  );
}

export default CategoryCard;
