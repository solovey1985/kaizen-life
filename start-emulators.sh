#!/bin/bash
# Start Firebase emulators with persistent data outside git repo

# Change to project directory
cd /g/Projects/kaizen-life

# Start emulators with data persistence
firebase emulators:start --import="../kaizen-life-emulator-data" --export-on-exit="../kaizen-life-emulator-data"