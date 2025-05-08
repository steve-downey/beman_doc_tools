#!/usr/bin/env python3
import argparse
import pathlib
import sys

parser = argparse.ArgumentParser(description='Renames the Doxygen-moxygen-generated API files, replacing :: with __ to make the files play nice with Docusaurus.')
parser.add_argument('path', type=pathlib.Path, help='The path to the API doc files to be renamed.')
args = parser.parse_args()

def recursively_visit_files(p):
    if not p.exists():
        print(f'{sys.argv[0]}: error: Path {p.name} not found.')
        sys.exit(1)
    for file_path in p.rglob("*"):
        if file_path.is_file():
            new_file_name = file_path.name.replace('::', '__')
            new_file_path = file_path.with_name(new_file_name)
            file_path.rename(new_file_path)

recursively_visit_files(args.path)
