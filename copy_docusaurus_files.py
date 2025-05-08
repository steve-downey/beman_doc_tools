#!/usr/bin/env python3
import argparse
import pathlib
import shutil

parser = argparse.ArgumentParser(description='Copies the Docusaurus files under "from" the destination tree "to", preserving the same structure, and replacing the default files produced by create-doxusaurus.')
parser.add_argument('from_', type=pathlib.Path, help='The "from" path from which to copy files.')
parser.add_argument('to', type=pathlib.Path, help='The "to" path to which to copy files.')
args = parser.parse_args()

shutil.copytree(args.from_, args.to, dirs_exist_ok=True)
