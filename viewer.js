(function () {
  'use strict';

  const DEFAULT_GRID_SIZE = 30;
  const STORAGE_PREVIEW_KEY = 'levelBuilderPreviewMap';

  const TILE_DEFS = {
    0: { label: 'Empty', id: 0 },
    1: { label: 'Wall', id: 1 },
    2: { label: 'Water', id: 2 },
    3: { label: 'Lava', id: 3 },
    4: { label: 'Spawn', id: 4 },
    10: { label: 'Floor 1', id: 10 },
    11: { label: 'Floor 2', id: 11 },
    12: { label: 'Floor 3', id: 12 }
  };

  const PALETTE_ORDER = [0, 1, 2, 3, 4, 10, 11, 12];

  const dom = {
    viewerGridContainer: document.getElementById('viewerGridContainer'),
    viewerImportInput: document.getElementById('viewerImportInput'),
    viewerGridSizeLabel: document.getElementById('viewerGridSizeLabel'),
    viewerGridSizeLabel2: document.getElementById('viewerGridSizeLabel2'),
    viewerMessage: document.getElementById('viewerMessage'),
    viewerTileLegend: document.getElementById('viewerTileLegend'),
    loadPreviewBtn: document.getElementById('loadPreviewBtn'),
    backToBuilderBtn: document.getElementById('backToBuilderBtn')
  };

  const state = {
    gridSize: DEFAULT_GRID_SIZE,
    tiles: createEmptyTileGrid(DEFAULT_GRID_SIZE)
  };

  initialize();

  function initialize() {
    renderLegend();
    renderGrid();
    bindEvents();
    updateStatus('Viewer ready. Load a JSON file or load preview from builder.');
  }

  function createEmptyTileGrid(gridSize) {
    return Array.from({ length: gridSize }, function () {
      return Array(gridSize).fill(0);
    });
  }

  function bindEvents() {
    dom.viewerImportInput.addEventListener('change', function (event) {
      if (!event.target.files || !event.target.files[0]) {
        return;
      }
      importMapFromFile(event.target.files[0]);
      event.target.value = '';
    });

    dom.loadPreviewBtn.addEventListener('click', function () {
      try {
        const raw = window.localStorage.getItem(STORAGE_PREVIEW_KEY);
        if (!raw) {
          updateStatus('No preview map found. Open viewer from builder after editing a map.', true);
          return;
        }
        const parsed = JSON.parse(raw);
        applyImportedPayload(parsed, 'Preview loaded from builder.');
      } catch (error) {
        updateStatus('Failed to load preview from builder: ' + error.message, true);
      }
    });

    dom.backToBuilderBtn.addEventListener('click', function () {
      window.location.href = 'index.html';
    });
  }

  function renderLegend() {
    dom.viewerTileLegend.innerHTML = '';
    PALETTE_ORDER.forEach(function (tileId) {
      const li = document.createElement('li');
      li.textContent = tileId + ' = ' + TILE_DEFS[tileId].label;
      dom.viewerTileLegend.appendChild(li);
    });
  }

  function renderGrid() {
    const size = state.gridSize;
    dom.viewerGridContainer.innerHTML = '';
    dom.viewerGridContainer.style.setProperty('--grid-size', String(size));

    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size; col += 1) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = String(row);
        cell.dataset.col = String(col);
        cell.dataset.tileId = String(state.tiles[row][col]);
        dom.viewerGridContainer.appendChild(cell);
      }
    }

    dom.viewerGridSizeLabel.textContent = String(size);
    dom.viewerGridSizeLabel2.textContent = String(size);
  }

  function importMapFromFile(file) {
    const reader = new FileReader();

    reader.onload = function () {
      try {
        const parsed = JSON.parse(String(reader.result));
        applyImportedPayload(parsed, 'Map loaded from file.');
      } catch (error) {
        updateStatus('Load failed: ' + error.message, true);
      }
    };

    reader.onerror = function () {
      updateStatus('Load failed: unable to read file.', true);
    };

    reader.readAsText(file);
  }

  function applyImportedPayload(payload, successMessage) {
    const validated = validateMapPayload(payload);
    state.gridSize = validated.gridSize;
    state.tiles = validated.tiles;
    renderGrid();
    updateStatus(successMessage);
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

    let spawnCount = 0;

    for (let row = 0; row < gridSize; row += 1) {
      if (!Array.isArray(tiles[row]) || tiles[row].length !== gridSize) {
        throw new Error('Each tiles row must have exactly gridSize columns.');
      }

      for (let col = 0; col < gridSize; col += 1) {
        const tileId = tiles[row][col];
        if (!Number.isInteger(tileId)) {
          throw new Error('Tile IDs must be integers.');
        }
        if (!Object.prototype.hasOwnProperty.call(TILE_DEFS, tileId)) {
          throw new Error('Unsupported tile ID found: ' + tileId);
        }
        if (tileId === 4) {
          spawnCount += 1;
        }
      }
    }

    if (spawnCount > 1) {
      throw new Error('Map can contain only one spawn tile (ID 4).');
    }

    return {
      gridSize: gridSize,
      tiles: tiles.map(function (row) {
        return row.slice();
      })
    };
  }

  function updateStatus(text, isError) {
    dom.viewerMessage.textContent = text;
    dom.viewerMessage.style.color = isError ? '#b42318' : '#42556f';
  }
})();
