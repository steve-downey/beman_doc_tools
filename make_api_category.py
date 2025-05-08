#!/usr/bin/env python3
import argparse
import pathlib
import sys

parser = argparse.ArgumentParser(description='Creates a _category_.json Docusaurus file.')
parser.add_argument('path', type=pathlib.Path, help='The path to the root of the API doc tree.')
args = parser.parse_args()

if not args.path.exists():
    print(f'{sys.argv[0]}: error: Path {args.path.name} not found.')
    sys.exit(1)

if not args.path.is_dir():
    print(f'{sys.argv[0]}: error: Path {args.path.name} is not a directory.')
    sys.exit(1)

# Using position 1000 so that the API entry will sit below all other
# hand-written pages.
(args.path / '_category_.json').write_text('''{
  "label": "API",
  "position": 1000,
  "link": {
    "type": "generated-index",
    "description": "API documentation."
  }
}
''')
