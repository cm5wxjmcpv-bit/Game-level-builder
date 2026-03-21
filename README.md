# Game Level Builder (GitHub Pages Ready)

This project is a plain HTML/CSS/JavaScript 2D level builder and viewer.

## Files

- `index.html` - level builder page
- `script.js` - builder logic (map sizing, tools, import/export)
- `viewer.html` - level viewer page
- `viewer.js` - viewer logic (preview + JSON loading)
- `style.css` - shared styles

## Builder Features

- Changeable map size (width + height, safe preserve-on-resize)
- Map type support (`level` and `town`)
- Paint tool and fill tool
- Expanded tile/object marker definitions for engine workflows
- Raw JSON export/import (backward-compatible shape)
- Engine-ready JSON export/import (formatVersion `2`)
- Preview-to-viewer flow via localStorage

## Export Formats

### Raw JSON

```json
{
  "width": 30,
  "height": 30,
  "mapType": "level",
  "mapId": "level_001",
  "mapName": "Starter Level",
  "tiles": [[0, 1, 10]]
}
```

### Engine JSON (`formatVersion: 2`)

```json
{
  "formatVersion": 2,
  "map": {
    "id": "level_001",
    "name": "Starter Level",
    "type": "level",
    "width": 30,
    "height": 30,
    "tiles": [[0, 1, 10]],
    "tileMetadata": [],
    "placements": {
      "playerStart": null,
      "portals": [],
      "enemySpawns": [],
      "shops": [],
      "fountains": [],
      "specials": [],
      "interactions": []
    },
    "future": {
      "npcSpawns": [],
      "scriptedEvents": [],
      "triggers": []
    }
  }
}
```

## Local Run

Open `index.html` in a browser.

## GitHub Pages

1. Push this repository to GitHub.
2. In repository **Settings > Pages**, set source to your default branch root.
3. Open the provided Pages URL.
