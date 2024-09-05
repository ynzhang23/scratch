import Image from "next/image";

export const EmptySearch = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image 
        src="/no-search.svg"
        alt="Empty"
        height={400}
        width={400}
      />
      <h2 className="text-2xl font-semibold mt-6">
        No results found
      </h2>
      <p className="text-muted-foreground textg-sm mt-2">
        Try searching for something else.
      </p>
    </div>
  )
}