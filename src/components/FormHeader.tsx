export default function FormHeader({ title }: { title: string }) {
  return (
    <div className="text-center py-1 w-full bg-[#800000] text-white poppins rounded-md">
      <h3 className="text-2xl">{title}</h3>
    </div>
  );
}
