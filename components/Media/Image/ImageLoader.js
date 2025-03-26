const { isObject, isObjectEmpty, isNotEmpty } = require("@/helpers/utils");

function ImageLoader({ category = null, media = [], fallback = null }) {
    function getImage() {
        if (!Array.isArray(media) || media.length === 0) {
            return false;
        }
        return media.find((item) => item?.type === 'image' && item?.category === category) || false;
    }
    function getFallback() {
        if (!isObject(fallback) || isObjectEmpty(fallback)) {
            return null;
        }
        return fallback;
    }
    const image = getImage();

    return (
        <>
            {isNotEmpty(image?.url)
                ? (
                    <img className="w-100" src={image.url} alt={image?.alt || 'Logo'} />
                )
                : getFallback()}
        </>
    );
}

export default ImageLoader;