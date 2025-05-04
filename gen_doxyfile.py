#!/usr/bin/env python3

from pathlib import Path
import re
import subprocess

doxyfile = Path('Doxyfile')

def doxyfile_exists():
    if not doxyfile.exists():
        return False
    if not doxyfile.is_file():
        raise IsADirectoryError('Doxyfile already exists, and is a directory.')
    return True

def generate_doxyfile():
    try:
        cmd = ['doxygen', '-g']
        subprocess.run(cmd, check=True, capture_output=True, text=True)
        print('Generated Doxyfile.')
        return True
    except subprocess.CalledProcessError as e:
        print(f"Command '{' '.join(cmd)}' failed with error: {e}")
        return False

# Each entry is a regex pattern, the generated/initial value, the replacement
# pattern, and whether the line should only be modified on an just-generated
# Doxyfile.
patterns_and_values = [
    (r'^RECURSIVE([ ]+)=([ ]+)(\w+)', 'NO', r'RECURSIVE\1=\2YES', True),
    (r'^INPUT([ ]+)=([ ]*)(\w*)', '', r'INPUT\1=\2 ../include ../src', True),
    (r'^EXCLUDE_SYMBOLS([ ]+)=([ ]*)(\w*)', '', r'EXCLUDE_SYMBOLS\1=\2 detail', True),
    (r'^GENERATE_XML([ ]+)=([ ]+)(\w+)', 'NO', r'GENERATE_XML\1=\2YES', False),
    (r'^GENERATE_HTML([ ]+)=([ ]+)(\w+)', 'YES', r'GENERATE_HTML\1=\2NO', False),
    (r'^GENERATE_LATEX([ ]+)=([ ]+)(\w+)', 'YES', r'GENERATE_LATEX\1=\2NO', False),
    (r'^HIDE_UNDOC_MEMBERS([ ]+)=([ ]+)(\w+)', 'NO', r'HIDE_UNDOC_MEMBERS\1=\2YES', False),
    (r'^HIDE_UNDOC_CLASSES([ ]+)=([ ]+)(\w+)', 'NO', r'HIDE_UNDOC_CLASSES\1=\2YES', False),
]

def modify_doxyfile(file_generated):
    lines = []
    modified = False
    with doxyfile.open(mode='r', encoding='utf-8') as f:
        for line in f.readlines():
            for (pattern, initial, replacement, generated_only) in \
                    patterns_and_values:
                if generated_only and not file_generated:
                    continue
                match = re.match(pattern, line)
                if not match or match.group(3) != initial:
                    continue
                line = re.sub(pattern, replacement, line)
                modified = True
                # They all match the beginning of the line differently; only
                # one will match.
                break
            lines.append(line)
    if modified:
        with doxyfile.open(mode='w', encoding='utf-8') as f:
            f.write(''.join(lines))
        print("Doxfile modified.  You may need to update the RECURSIVE, INPUT, EXCLUDE, and EXCLUDE_PATTERNS parameters that control which files are scanned, and the EXCLUDE_SYMBOLS parameter to exclude things like exposition-only/detail functions, class types, and namespaces.")

file_generated = False
if not doxyfile_exists():
    generate_doxyfile()
    file_generated = True
modify_doxyfile(file_generated)
