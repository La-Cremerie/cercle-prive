set -e
cd "$(dirname "$0")"
node build-slides.js >/dev/null
rm -rf unpacked slides-out.pptx && mkdir unpacked
(cd unpacked && python3 -c "import zipfile;zipfile.ZipFile('../Villa-Roi-de-la-Camargue-slides.pptx').extractall('.')")
../.venv/bin/python - <<'PY'
import re, pathlib, shutil
u = pathlib.Path("unpacked")
for d in ("ppt/notesSlides", "ppt/notesMasters"): shutil.rmtree(u / d, ignore_errors=True)
ct = u / "[Content_Types].xml"; ct.write_text(re.sub(r'<Override PartName="/ppt/notes(Slides|Masters)/[^"]+"[^/]*/>', "", ct.read_text()))
for rel in (u / "ppt/slides/_rels").glob("*.rels"):
    rel.write_text(re.sub(r'<Relationship[^>]*notesSlide[^>]*/>', "", rel.read_text()))
pr = u / "ppt/presentation.xml"; pr.write_text(re.sub(r'<p:notesMasterIdLst>.*?</p:notesMasterIdLst>', "", pr.read_text(), flags=re.S))
prr = u / "ppt/_rels/presentation.xml.rels"; prr.write_text(re.sub(r'<Relationship[^>]*notesMaster[^>]*/>', "", prr.read_text()))
PY
(cd unpacked && zip -Xr9q ../slides-out.pptx .)
