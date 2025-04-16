import { StyleBuilder } from "./StyleBuilder";

test('can add background to style', () => {
    const styleBuilder = StyleBuilder.getInstance();
    const backgroundImage = 'https://example.com/image.jpg';
    const result = styleBuilder.addBackgroundImage(backgroundImage);
    expect(result).toEqual({backgroundImage: `url(${backgroundImage})`});
});

