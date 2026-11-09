"""Render all four Serbian and English catalogue pages as images.

Both variants preserve the source catalogue's photographic artwork.
The English copy and placements are taken from its approved A5 edition.
Run this before the Vite build; the output directory is generated.
"""
import json
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/projects/unseen/unseen-katalog-A5.pdf"
DEST = ROOT / "public/projects/unseen/catalogue"
ENGLISH_RUNS = json.loads(r'''[[[140,47.3,0,8,15986414,"KATARINA RANKOVIĆ / MLADEN ILIĆ"],[69.1,160.3,3,76,15986414,"un"],[158.6,160.3,3,76,13445650,":"],[181.6,160.3,3,76,15986414,"seen"],[152.8,192.3,0,12,15986414,"Interactive installation"],[155.4,501.3,0,12,15986414,"27 Nov - 8 Dec 2026"],[149.3,521.3,0,10,15986414,"FSU Plus Gallery, Belgrade"]],[[30,32,1,8,1118481,"ABOUT THE EXHIBITION"],[380.9,573.3,0,7,1118481,"02"],[30,94.3,2,19,1118481,"Between an image and the way we see it,"],[30,117.3,2,19,1118481,"between experience and words,"],[30,140.3,2,19,1118481,"something remains beyond translation."],[30,173.8,0,10.5,1118481,"un:seen is an interactive installation by Katarina Ranković and Mladen Ilić. It"],[30,187.8,0,10.5,1118481,"explores what happens as experience becomes language, and language"],[30,201.8,0,10.5,1118481,"becomes a new image. Bringing together painting, visitors’ descriptions and"],[30,215.8,0,10.5,1118481,"generative AI, the installation makes perception part of the work."],[30,241.8,0,10.5,1118481,"The physical presence of Hrabrost (Courage) is set against a changing series"],[30,255.8,0,10.5,1118481,"of digital interpretations generated from visitors’ descriptions. The AI model"],[30,269.8,0,10.5,1118481,"never sees the original painting; it knows it only through someone else’s"],[30,283.8,0,10.5,1118481,"words. Each new image bears the imprint of a personal response,"],[30,297.8,0,10.5,1118481,"transformed in the act of translation."],[30,330.3,2,13,1118481,"What is carried over, and what takes shape between image,"],[30,347.3,2,13,1118481,"perception and words?"],[93.9,563.3,0,7,1118481,"Installation visualisation, 2026."]],[[30,32,1,8,16119023,"ARTWORK"],[380.9,573.3,0,7,16119023,"03"],[30,469.3,1,10,16119023,"Mladen Ilić"],[30,499.3,2,25,16119023,"Hrabrost (Courage)"],[350.9,469.3,0,9,16119023,"2026"],[30,522.3,0,9,16119023,"Oil and pastel on canvas"],[30,536.3,0,9,16119023,"80 × 80 cm"]],[[30,32,1,8,1118481,"ARTISTS"],[380.9,573.3,0,7,1118481,"04"],[30,80.3,3,22,1118481,"Mladen Ilić"],[30,114.3,0,10,1118481,"Mladen Ilić is a painter and literature teacher. His paintings"],[30,128.3,0,10,1118481,"develop slowly and intuitively, exploring inner states and the"],[30,142.3,0,10,1118481,"relationship between conscious and unconscious experience."],[30,156.3,0,10,1118481,"Literature informs the narratives and symbolism in his work."],[30,170.3,0,10,1118481,"Working primarily in oil on canvas, he uses gesso and other"],[30,184.3,0,10,1118481,"materials to build richly textured surfaces, repeatedly"],[30,198.3,0,10,1118481,"reworking them and allowing traces of the process to remain"],[30,212.3,0,10,1118481,"visible. His work is held in private collections around the"],[30,226.3,0,10,1118481,"world."],[30,329.3,3,22,1118481,"Katarina Ranković"],[30,363.3,0,10,1118481,"Katarina Ranković is a programmer with a background in"],[30,377.3,0,10,1118481,"computer science. She has worked on video games, VR"],[30,391.3,0,10,1118481,"experiences and interactive applications. Her interests lie in"],[30,405.3,0,10,1118481,"installation art and the creative use of technology in art and"],[30,419.3,0,10,1118481,"design."],[30,532.3,1,9,1118481,"FSU Plus Gallery"],[30,546.3,0,9,1118481,"Belgrade"],[233,532.3,0,9,1118481,"27 Nov - 8 Dec 2026"]]]''')

FONT_NAMES = ("Sans", "SansBold", "Serif", "Display")
FONT_FILES = (
    "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf",
    "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation2/LiberationSerif-Regular.ttf",
    "/usr/share/fonts/truetype/noto/NotoSans-Light.ttf",
)


def render(page, destination):
    # A5 pages rendered at approximately 144 dpi, with legible small text.
    pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
    destination.write_bytes(pix.tobytes("jpeg", jpg_quality=88))


def main():
    if not SOURCE.exists():
        raise FileNotFoundError(f"Catalogue missing: {SOURCE}")
    for language in ("en", "sr"):
        (DEST / language).mkdir(parents=True, exist_ok=True)
    document = fitz.open(SOURCE)
    if len(document) != len(ENGLISH_RUNS):
        raise ValueError("Source catalogue page count differs from English edition")

    # Render Serbian exactly as supplied.
    for index, page in enumerate(document):
        render(page, DEST / "sr" / f"page-{index + 1}.jpg")

    # Make the English edition from the same background artwork and page
    # composition, replacing Serbian text with the English catalogue copy.
    for index, page in enumerate(document):
        for block in page.get_text("dict")["blocks"]:
            for line in block.get("lines", []):
                for span in line["spans"]:
                    if span["text"].strip():
                        page.add_redact_annot(
                            fitz.Rect(span["bbox"]) + (-0.1, -0.1, 0.1, 0.1),
                            fill=False,
                        )
        page.apply_redactions(images=0, graphics=0, text=0)

        for i, filename in enumerate(FONT_FILES):
            path = Path(filename)
            if not path.exists():
                raise FileNotFoundError(f"Required catalogue font: {path}")
            page.insert_font(fontname=FONT_NAMES[i], fontfile=str(path))

        for x, y, font_index, size, rgb, caption in ENGLISH_RUNS[index]:
            color = tuple(((rgb >> shift) & 255) / 255 for shift in (16, 8, 0))
            page.insert_text(
                (x, y),
                caption,
                fontname=FONT_NAMES[font_index],
                fontsize=size,
                color=color,
                overlay=True,
            )
        render(page, DEST / "en" / f"page-{index + 1}.jpg")


if __name__ == "__main__":
    main()
