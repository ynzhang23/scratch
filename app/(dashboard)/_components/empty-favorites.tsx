import Image from "next/image";

export const EmptyFavorites = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image 
        src="/no-favorites.svg"
        alt="Empty"
        height={200}
        width={200}
      />
      <h2 className="text-2xl font-semibold mt-6">
        No favorite boards.
      </h2>
      <p className="text-muted-foreground textg-sm mt-2">
        Try adding a board to favorites!
      </p>
    </div>
  )
}