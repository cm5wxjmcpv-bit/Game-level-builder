(function () {
  'use strict';

  const DEFAULT_GRID_SIZE = 30;
  const TILE_SIZE = 100;
  const STORAGE_PREVIEW_KEY = 'levelBuilderPreviewMap';

  const TILE_DEFS = {
    0: { label: 'Empty', id: 0, unique: false },
    1: { label: 'Wall', id: 1, unique: false },
    2: { label: 'Water', id: 2, unique: false },
    3: { label: 'Lava', id: 3, unique: false },
    4: { label: 'Spawn', id: 4, unique: true },
    5: { label: 'Portal', id: 5, unique: true },
    6: { label: 'Enemy Camp', id: 6, unique: false },
    7: { label: 'Bridge', id: 7, unique: false },
    10: { label: 'Floor 1', id: 10, unique: false },
    11: { label: 'Floor 2', id: 11, unique: false },
    12: { label: 'Floor 3', id: 12, unique: false }
  };

  const PALETTE_ORDER = [0, 1, 2, 3, 4, 5, 6, 7, 10, 11, 12];
  const UNIQUE_TILE_IDS = [4, 5];

  const dom = {
    gridContainer: document.getElementById('gridContainer'),
    palette: document.getElementById('palette'),
    eraserBtn: document.getElementById('eraserBtn'),
    selectedToolLabel: document.getElementById('selectedToolLabel'),
    gridSizeLabel: document.getElementById('gridSizeLabel'),
    gridSizeLabel2: document.getElementById('gridSizeLabel2'),
    message: document.getElementById('message'),
    tileLegend: document.getElementById('tileLegend'),
    exportBtn: document.getElementById('exportBtn'),
    exportGameBtn: document.getElementById('exportGameBtn'),
    importInput: document.getElementById('importInput'),
    clearBtn: document.getElementById('clearBtn'),
    openViewerBtn: document.getElementById('openViewerBtn')
  };

  const state = {
    gridSize: DEFAULT_GRID_SIZE,
    tiles: createEmptyTileGrid(DEFAULT_GRID_SIZE),
    selectedTileId: 1,
    isPainting: false,
    lastPaintedCellKey: ''
  };

  initialize();

  function initialize() {
    renderPalette();
    renderLegend(dom.tileLegend);
    renderGrid();
    bindEvents();
    setSelectedTile(1);
    updateStatus('Ready. Click or drag on the grid to paint tiles.');
  }

  function createEmptyTileGrid(gridSize) {
    return Array.from({ length: gridSize }, function () {
      return Array(gridSize).fill(0);
    });
  }

  function renderPalette() {
    dom.palette.innerHTML = '';

    PALETTE_ORDER.forEach(function (tileId) {
      const tile = TILE_DEFS[tileId];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tile-btn';
      btn.dataset.tileId = String(tileId);
      btn.setAttribute('aria-label', 'Select tile ' + tile.label + ' (ID ' + tileId + ')');

      const colorDot = document.createElement('span');
      colorDot.className = 'tile-color-dot';
      colorDot.style.background = getTileColor(tileId);

      const text = document.createElement('span');
      text.textContent = tile.label + ' (' + tileId + ')';

      btn.appendChild(colorDot);
      btn.appendChild(text);

      btn.addEventListener('click', function () {
        setSelectedTile(tileId);
      });

      dom.palette.appendChild(btn);
    });
  }

  function renderLegend(target) {
    target.innerHTML = '';
    PALETTE_ORDER.forEach(function (tileId) {
      const tile = TILE_DEFS[tileId];
      const li = document.createElement('li');
      li.textContent = tileId + ' = ' + tile.label;
      target.appendChild(li);
    });
  }

  function renderGrid() {
    const size = state.gridSize;
    dom.gridContainer.innerHTML = '';
    dom.gridContainer.style.setProperty('--grid-size', String(size));

    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size; col += 1) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = String(row);
        cell.dataset.col = String(col);
        cell.dataset.tileId = String(state.tiles[row][col]);
        dom.gridContainer.appendChild(cell);
      }
    }

    dom.gridSizeLabel.textContent = String(size);
    dom.gridSizeLabel2.textContent = String(size);
  }

  function bindEvents() {
    dom.gridContainer.addEventListener('mousedown', function (event) {
      const cell = getCellFromEventTarget(event.target);
      if (!cell) {
        return;
      }
      event.preventDefault();
      state.isPainting = true;
      state.lastPaintedCellKey = '';
      paintCellFromElement(cell);
    });

    dom.gridContainer.addEventListener('mouseover', function (event) {
      if (!state.isPainting) {
        return;
      }
      const cell = getCellFromEventTarget(event.target);
      if (!cell) {
        return;
      }
      paintCellFromElement(cell);
    });

    document.addEventListener('mouseup', function () {
      state.isPainting = false;
      state.lastPaintedCellKey = '';
    });

    dom.gridContainer.addEventListener('click', function (event) {
      const cell = getCellFromEventTarget(event.target);
      if (!cell) {
        return;
      }
      paintCellFromElement(cell);
    });

    dom.eraserBtn.addEventListener('click', function () {
      setSelectedTile(0);
    });

    dom.exportBtn.addEventListener('click', exportRawMapToFile);
    dom.exportGameBtn.addEventListener('click', exportGameLevelToFile);

    dom.importInput.addEventListener('change', function (event) {
      if (!event.target.files || !event.target.files[0]) {
        return;
      }
      importMapFromFile(event.target.files[0]);
      event.target.value = '';
    });

    dom.clearBtn.addEventListener('click', function () {
      const confirmed = window.confirm('Clear the entire map? This cannot be undone.');
      if (!confirmed) {
        return;
      }
      state.tiles = createEmptyTileGrid(state.gridSize);
      renderGrid();
      updateStatus('Map cleared.');
    });

    dom.openViewerBtn.addEventListener('click', function () {
      const payload = serializeMap();
      try {
        window.localStorage.setItem(STORAGE_PREVIEW_KEY, JSON.stringify(payload));
      } catch (storageError) {
        updateStatus('Could not save preview to localStorage: ' + storageError.message, true);
        return;
      }
      window.location.href = 'viewer.html';
    });

    document.addEventListener('dragstart', function (event) {
      if (event.target && event.target.classList && event.target.classList.contains('cell')) {
        event.preventDefault();
      }
    });
  }

  function getCellFromEventTarget(target) {
    if (!target || !target.classList || !target.classList.contains('cell')) {
      return null;
    }
    return target;
  }

  function paintCellFromElement(cell) {
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);

    if (!Number.isInteger(row) || !Number.isInteger(col)) {
      return;
    }

    const currentKey = row + ',' + col;
    if (state.lastPaintedCellKey === currentKey && state.isPainting) {
      return;
    }
    state.lastPaintedCellKey = currentKey;

    applyTileAt(row, col, state.selectedTileId);
    cell.dataset.tileId = String(state.tiles[row][col]);
  }

  function applyTileAt(row, col, tileId) {
    if (UNIQUE_TILE_IDS.indexOf(tileId) !== -1) {
      clearExistingUniqueTile(tileId);
    }

    state.tiles[row][col] = tileId;

    if (UNIQUE_TILE_IDS.indexOf(tileId) !== -1) {
      repaintAllCells();
    }
  }

  function clearExistingUniqueTile(tileId) {
    for (let row = 0; row < state.gridSize; row += 1) {
      for (let col = 0; col < state.gridSize; col += 1) {
        if (state.tiles[row][col] === tileId) {
          state.tiles[row][col] = 0;
        }
      }
    }
  }

  function repaintAllCells() {
    const cells = dom.gridContainer.querySelectorAll('.cell');
    cells.forEach(function (cell) {
      const row = Number(cell.dataset.row);
      const col = Number(cell.dataset.col);
      cell.dataset.tileId = String(state.tiles[row][col]);
    });
  }

  function setSelectedTile(tileId) {
    state.selectedTileId = tileId;

    const tileButtons = dom.palette.querySelectorAll('.tile-btn');
    tileButtons.forEach(function (btn) {
      const isActive = Number(btn.dataset.tileId) === tileId;
      btn.classList.toggle('active', isActive);
    });

    dom.eraserBtn.classList.toggle('active', tileId === 0);
    const selected = TILE_DEFS[tileId] ? TILE_DEFS[tileId].label : 'Unknown';
    dom.selectedToolLabel.textContent = selected + ' (ID ' + tileId + ')';
  }

  function exportRawMapToFile() {
    const payload = serializeMap();
    const text = JSON.stringify(payload, null, 2);

    downloadTextAsFile(text, 'level-' + payload.gridSize + 'x' + payload.gridSize + '.json');
    updateStatus('Raw map exported as JSON.');
  }

  function exportGameLevelToFile() {
    try {
      normalizeUniqueTilesInState();
      const gameLevel = buildGameLevelObject();
      const text = JSON.stringify(gameLevel, null, 2);
      downloadTextAsFile(text, 'game-level-' + gameLevel.id + '.json');
      updateStatus('Game level exported successfully.');
      repaintAllCells();
    } catch (error) {
      updateStatus('Game export failed: ' + error.message, true);
    }
  }

  function downloadTextAsFile(text, filename) {
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  }

  function importMapFromFile(file) {
    const reader = new FileReader();

    reader.onload = function () {
      try {
        const parsed = JSON.parse(String(reader.result));
        const validated = validateMapPayload(parsed);
        state.gridSize = validated.gridSize;
        state.tiles = validated.tiles;
        const normalizedInfo = normalizeUniqueTilesInState();
        renderGrid();
        if (normalizedInfo.removedSpawn > 0 || normalizedInfo.removedPortal > 0) {
          updateStatus('Map imported and normalized (extra spawn/portal tiles were removed).');
        } else {
          updateStatus('Map imported successfully.');
        }
      } catch (error) {
        updateStatus('Import failed: ' + error.message, true);
      }
    };

    reader.onerror = function () {
      updateStatus('Import failed: unable to read file.', true);
    };

    reader.readAsText(file);
  }

  function serializeMap() {
    return {
      gridSize: state.gridSize,
      tiles: state.tiles.map(function (row) {
        return row.slice();
      })
    };
  }

  function validateMapPayload(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('JSON must be an object.');
    }

    const gridSize = data.gridSize;
    const tiles = data.tiles;

    if (!Number.isInteger(gridSize) || gridSize <= 0) {
      throw new Error('gridSize must be a positive integer.');
    }

    if (!Array.isArray(tiles) || tiles.length !== gridSize) {
      throw new Error('tiles must be an array with exactly gridSize rows.');
    }

    for (let row = 0; row < gridSize; row += 1) {
      if (!Array.isArray(tiles[row]) || tiles[row].length !== gridSize) {
        throw new Error('Each row in tiles must have exactly gridSize columns.');
      }

      for (let col = 0; col < gridSize; col += 1) {
        const tileId = tiles[row][col];
        if (!Number.isInteger(tileId)) {
          throw new Error('Tile IDs must be integers.');
        }
        if (!Object.prototype.hasOwnProperty.call(TILE_DEFS, tileId)) {
          throw new Error('Unsupported tile ID found: ' + tileId);
        }
      }
    }

    return {
      gridSize: gridSize,
      tiles: tiles.map(function (row) {
        return row.slice();
      })
    };
  }

  function normalizeUniqueTilesInState() {
    const info = {
      removedSpawn: normalizeUniqueTile(4),
      removedPortal: normalizeUniqueTile(5)
    };
    return info;
  }

  function normalizeUniqueTile(tileId) {
    let seenFirst = false;
    let removed = 0;

    for (let row = 0; row < state.gridSize; row += 1) {
      for (let col = 0; col < state.gridSize; col += 1) {
        if (state.tiles[row][col] !== tileId) {
          continue;
        }
        if (!seenFirst) {
          seenFirst = true;
        } else {
          state.tiles[row][col] = 0;
          removed += 1;
        }
      }
    }

    return removed;
  }

  function buildGameLevelObject() {
    const map = serializeMap();

    const walls = [];
    const bridges = [];
    const camps = [];

    let spawnPoint = null;
    let portalPoint = null;

    for (let row = 0; row < map.gridSize; row += 1) {
      for (let col = 0; col < map.gridSize; col += 1) {
        const tileId = map.tiles[row][col];
        const tileX = col * TILE_SIZE;
        const tileY = row * TILE_SIZE;
        const centerX = tileX + TILE_SIZE / 2;
        const centerY = tileY + TILE_SIZE / 2;

        if (tileId === 1) {
          walls.push({
            x: tileX,
            y: tileY,
            w: TILE_SIZE,
            h: TILE_SIZE,
            type: 'rock'
          });
        } else if (tileId === 4) {
          spawnPoint = { x: centerX, y: centerY };
        } else if (tileId === 5) {
          portalPoint = { x: centerX, y: centerY, radius: 40 };
        } else if (tileId === 6) {
          camps.push({
            x: centerX,
            y: centerY,
            count: 4,
            radius: 180
          });
        } else if (tileId === 7) {
          bridges.push({
            x: tileX,
            y: tileY,
            w: TILE_SIZE,
            h: TILE_SIZE,
            type: 'bridge'
          });
        }
      }
    }

    if (!spawnPoint) {
      throw new Error('Map must contain one spawn tile (ID 4) before exporting game level.');
    }

    if (!portalPoint) {
      throw new Error('Map must contain one portal tile (ID 5) before exporting game level.');
    }

    return {
      id: 99,
      name: 'Builder Map',
      bg: '#59743b',
      ground2: '#6f8f49',
      accent: '#92b85a',
      obstacleColor: '#41552d',
      slimeColor: '#89d15b',
      bridgeColor: '#8f6a3b',
      width: map.gridSize * TILE_SIZE,
      height: map.gridSize * TILE_SIZE,
      playerStart: spawnPoint,
      portal: portalPoint,
      walls: walls,
      bridges: bridges,
      camps: camps,
      decorations: { type: 'default', count: 0, items: [] },
      enemyHp: 44,
      enemyDamage: 12,
      enemySpeed: 1.25,
      enemyCount: camps.length * 4,
      moneyDrop: [8, 13]
    };
  }

  function updateStatus(text, isError) {
    dom.message.textContent = text;
    dom.message.style.color = isError ? '#b42318' : '#42556f';
  }

  function getTileColor(tileId) {
    switch (tileId) {
      case 0: return 'var(--empty)';
      case 1: return 'var(--wall)';
      case 2: return 'var(--water)';
      case 3: return 'var(--lava)';
      case 4: return 'var(--spawn)';
      case 5: return 'var(--portal)';
      case 6: return 'var(--camp)';
      case 7: return 'var(--bridge)';
      case 10: return 'var(--floor1)';
      case 11: return 'var(--floor2)';
      case 12: return 'var(--floor3)';
      default: return '#000000';
    }
  }
})();
