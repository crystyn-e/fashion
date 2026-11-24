export default function ImagePositionPicker({
    src,
    positionX,
    positionY,
}) {
    return (
        <div className="mx-auto aspect-[4/5] w-48 overflow-hidden rounded-xl shadow-md">
            <img
                src={src}
                alt="Pratinjau gambar"
                className="h-full w-full object-cover"
                style={{
                    objectPosition: `${positionX}% ${positionY}%`,
                }}
            />
        </div>
    );
}
