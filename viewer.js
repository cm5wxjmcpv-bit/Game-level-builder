(function () {
  'use strict';

  const DEFAULT_WIDTH = 30;
  const DEFAULT_HEIGHT = 30;
  const STORAGE_PREVIEW_KEY = 'levelBuilderPreviewMap';

  const TILE_DEFINITIONS = [
    { id: 0, label: 'Empty', category: 'base', color: '#e9edf3' },
    { id: 10, label: 'Floor - Stone', category: 'floor', color: '#d3be95' },
    { id: 11, label: 'Floor - Wood', category: 'floor', color: '#c4b0e2' },
    { id: 12, label: 'Floor - Grass', category: 'floor', color: '#9ac8b4' },
    { id: 13, label: 'Floor - Sand', category: 'floor', color: '#ebd089' },
    { id: 1, label: 'Wall', category: 'barrier', color: '#4c5563' },
    { id: 7, label: 'Bridge', category: 'specialTile', color: '#8f6a3b' },
    { id: 2, label: 'Water', category: 'hazard', color: '#2a78c8' },
    { id: 3, label: 'Lava', category: 'hazard', color: '#e65032' },
    { id: 21, label: 'Swamp', category: 'hazard', color: '#5e7f45' },
    { id: 4, label: 'Player Start', category: 'levelObject', color: '#26a05f' },
    { id: 5, label: 'Portal', category: 'object', color: '#6c4ad2' },
    { id: 6, label: 'Enemy Spawn', category: 'levelObject', color: '#8b5a2b' },
    { id: 100, label: 'Blacksmith', category: 'townObject', color: '#b45309' },
    { id: 101, label: 'Armor Shop', category: 'townObject', color: '#7c3aed' },
    { id: 102, label: 'Potion Shop', category: 'townObject', color: '#be185d' },
    { id: 103, label: 'Special Shop', category: 'townObject', color: '#9333ea' },
    { id: 104, label: 'General Shop', category: 'townObject', color: '#0f766e' },
    { id: 105, label: 'Healing Fountain', category: 'townObject', color: '#0ea5e9' },
    { id: 106, label: 'NPC / Interaction', category: 'townObject', color: '#64748b' },
    { id: 120, label: 'Chest Marker', category: 'specialObject', color: '#92400e' },
    { id: 121, label: 'Trigger Marker', category: 'specialObject', color: '#1d4ed8' },
    { id: 122, label: 'Boss Marker', category: 'specialObject', color: '#991b1b' }
  ];

  const TILE_DEFS_BY_ID = TILE_DEFINITIONS.reduce(function (acc, tile) {
    acc[tile.id] = tile;
    return acc;
  }, {});

  const dom = {
    viewerGridContainer: document.getElementById('viewerGridContainer'),
    viewerImportInput: document.getElementById('viewerImportInput'),
    viewerGridSizeLabel: document.getElementById('viewerGridSizeLabel'),
    viewerGridSizeLabel2: document.getElementById('viewerGridSizeLabel2'),
    viewerMapTypeLabel: document.getElementById('viewerMapTypeLabel'),
    viewerMapIdLabel: document.getElementById('viewerMapIdLabel'),
    viewerMessage: document.getElementById('viewerMessage'),
    viewerTileLegend: document.getElementById('viewerTileLegend'),
    loadPreviewBtn: document.getElementById('loadPreviewBtn'),
    backToBuilderBtn: document.getElementById('backToBuilderBtn')
  };

  const state = {
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    mapType: 'level',
    mapId: 'unknown',
    tiles: createEmptyTileGrid(DEFAULT_WIDTH, DEFAULT_HEIGHT)
  };

  initialize();

  function initialize() {
    renderLegend();
    renderGrid();
    bindEvents();
    updateMapLabels();
    updateStatus('Viewer ready. Load a JSON file or load preview from builder.');
  }

  function createEmptyTileGrid(width, height) {
    return Array.from({ length: height }, function () {
      return Array(width).fill(0);
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
        const normalized = normalizeImportedPayload(parsed);
        applyImportedPayload(normalized, 'Preview loaded from builder.');
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
    TILE_DEFINITIONS.forEach(function (tile) {
      const li = document.createElement('li');
      li.textContent = tile.id + ' = ' + tile.label + ' [' + tile.category + ']';
      dom.viewerTileLegend.appendChild(li);
    });
  }

  function renderGrid() {
    dom.viewerGridContainer.innerHTML = '';
    dom.viewerGridContainer.style.setProperty('--grid-width', String(state.width));
    dom.viewerGridContainer.style.setProperty('--grid-height', String(state.height));

    for (let row = 0; row < state.height; row += 1) {
      for (let col = 0; col < state.width; col += 1) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = String(row);
        cell.dataset.col = String(col);
        const tileId = state.tiles[row][col];
        cell.dataset.tileId = String(tileId);
        cell.style.backgroundColor = getTileColor(tileId);
        dom.viewerGridContainer.appendChild(cell);
      }
    }

    dom.viewerGridSizeLabel.textContent = String(state.width);
    dom.viewerGridSizeLabel2.textContent = String(state.height);
    updateMapLabels();
  }

  function getTileColor(tileId) {
    if (Object.prototype.hasOwnProperty.call(TILE_DEFS_BY_ID, tileId)) {
      return TILE_DEFS_BY_ID[tileId].color;
    }
    return '#9ca3af';
  }

  function importMapFromFile(file) {
    const reader = new FileReader();

    reader.onload = function () {
      try {
        const parsed = JSON.parse(String(reader.result));
        const normalized = normalizeImportedPayload(parsed);
        applyImportedPayload(normalized, 'Map loaded from file.');
      } catch (error) {
        updateStatus('Load failed: ' + error.message, true);
      }
    };

    reader.onerror = function () {
      updateStatus('Load failed: unable to read file.', true);
    };

    reader.readAsText(file);
  }

  function normalizeImportedPayload(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('JSON must be an object.');
    }

    if (data.formatVersion === 2 && data.map) {
      return normalizeMapLikeObject(data.map);
    }

    return normalizeMapLikeObject(data);
  }

  function normalizeMapLikeObject(mapData) {
    const width = Number.isInteger(mapData.width) ? mapData.width : Number.isInteger(mapData.gridSize) ? mapData.gridSize : null;
    const height = Number.isInteger(mapData.height) ? mapData.height : Number.isInteger(mapData.gridSize) ? mapData.gridSize : null;
    const tiles = mapData.tiles;

    if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
      throw new Error('width/height (or gridSize) must be positive integers.');
    }

    if (!Array.isArray(tiles) || tiles.length !== height) {
      throw new Error('tiles must be an array with exactly height rows.');
    }

    const normalizedTiles = tiles.map(function (row) {
      if (!Array.isArray(row) || row.length !== width) {
        throw new Error('Each tiles row must have exactly width columns.');
      }

      return row.map(function (tileId) {
        if (!Number.isInteger(tileId)) {
          throw new Error('Tile IDs must be integers.');
        }
        return tileId;
      });
    });

    return {
      width: width,
      height: height,
      mapType: mapData.type === 'town' || mapData.mapType === 'town' ? 'town' : 'level',
      mapId: String(mapData.id || mapData.mapId || 'imported_map'),
      tiles: normalizedTiles
    };
  }

  function applyImportedPayload(normalized, successMessage) {
    state.width = normalized.width;
    state.height = normalized.height;
    state.mapType = normalized.mapType;
    state.mapId = normalized.mapId;
    state.tiles = normalized.tiles;

    renderGrid();
    updateStatus(successMessage);
  }

  function updateMapLabels() {
    dom.viewerMapTypeLabel.textContent = state.mapType;
    dom.viewerMapIdLabel.textContent = state.mapId;
  }

  function updateStatus(text, isError) {
    dom.viewerMessage.textContent = text;
    dom.viewerMessage.style.color = isError ? '#b42318' : '#42556f';
  }
})();
