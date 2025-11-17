import Image from 'next/image';

export default function ProductCard({ product }) {
  const { name, image } = product;

  return (
    <article className="w-full max-w-[280px] mx-auto flex flex-col bg-white rounded-2xl border border-neutral-200 p-3 shadow-sm hover:shadow-md transition">
      <div className="aspect-square w-full overflow-hidden rounded-xl bg-neutral-100">
        {image ? (
          <Image
            src={image}
            alt={name}
            className="h-full w-full object-contain"
            width={400}
            height={400}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-neutral-500">
            Ingen billede
          </div>
        )}
      </div>

      <h3 className="mt-3 text-center text-base font-semibold text-neutral-800">
        {name}
      </h3>
    </article>
  );
}
