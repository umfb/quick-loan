export default function MiniHeader({ title }: { title: string }) {
  return (
    <div className="py-1 text-white bg-[#800000] poppins text-center w-full font-semibold rounded-sm">
      <span>{title}</span>
    </div>
  );
}
