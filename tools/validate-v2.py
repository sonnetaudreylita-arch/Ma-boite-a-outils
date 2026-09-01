import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = {name: json.loads((ROOT / 'data' / name).read_text(encoding='utf-8')) for name in (
    'glossary.v2.json', 'artists.v2.json', 'works.v2.json',
    'workshops.v2.json', 'cultural-objects.v2.json', 'media.v2.json')}
G, A, W, WS, O, M = (DATA[n] for n in DATA)
sets = {k: {x['id'] for x in v} for k, v in (
    ('glossary', G), ('artists', A), ('works', W), ('workshops', WS),
    ('objects', O), ('media', M))}
errors = []

def check(items, relations, label):
    for item in items:
        for field, target in relations:
            for value in item.get(field, []):
                if value not in sets[target]:
                    errors.append(f'{label} {item.get("id")}: {field} -> {value}')

check(WS, [('glossaryIds','glossary'), ('artistIds','artists'), ('mediaIds','media')], 'workshop')
check(A, [('workIds','works'), ('glossaryIds','glossary'), ('workshopIds','workshops'), ('mediaIds','media')], 'artist')
check(W, [('glossaryIds','glossary'), ('workshopIds','workshops'), ('mediaIds','media')], 'work')
check(O, [('glossaryIds','glossary'), ('workshopIds','workshops'), ('artistIds','artists'), ('mediaIds','media')], 'object')
for work in W:
    if work.get('artistId') and work['artistId'] not in sets['artists']:
        errors.append(f'work {work["id"]}: artistId -> {work["artistId"]}')

print(f'collections: {len(G)} glossary; {len(A)} artists; {len(W)} works; {len(WS)} workshops; {len(O)} objects; {len(M)} media')
print(f'relation errors: {len(errors)}')
for error in errors:
    print(' -', error)
missing = [(x['id'], x.get('missingMediaIds', [])) for x in WS if x.get('missingMediaIds')]
print('source media flagged missing:', missing or 'none')
raise SystemExit(1 if errors else 0)
