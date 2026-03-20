(function () {
  'use strict';

  const DEFAULT_WIDTH = 30;
  const DEFAULT_HEIGHT = 30;
  const STORAGE_PREVIEW_KEY = 'levelBuilderPreviewMap';
  const MAX_MAP_SIDE = 200;

  const TILE_DEFINITIONS = [
    { id: 0, label: 'Empty', category: 'base', color: '#e9edf3', mapTypes: ['level', 'town'] },

    { id: 10, label: 'Floor - Stone', category: 'floor', color: '#d3be95', mapTypes: ['level', 'town'] },
    { id: 11, label: 'Floor - Wood', category: 'floor', color: '#c4b0e2', mapTypes: ['level', 'town'] },
    { id: 12, label: 'Floor - Grass', category: 'floor', color: '#9ac8b4', mapTypes: ['level', 'town'] },
    { id: 13, label: 'Floor - Sand', category: 'floor', color: '#ebd089', mapTypes: ['level', 'town'] },

    { id: 1, label: 'Wall', category: 'barrier', color: '#4c5563', mapTypes: ['level', 'town'] },
    { id: 7, label: 'Bridge', category: 'specialTile', color: '#8f6a3b', mapTypes: ['level', 'town'] },

    { id: 2, label: 'Water', category: 'hazard', color: '#2a78c8', mapTypes: ['level', 'town'], effect: 'water' },
    { id: 3, label: 'Lava', category: 'hazard', color: '#e65032', mapTypes: ['level'], effect: 'lava' },
    { id: 21, label: 'Swamp', category: 'hazard', color: '#5e7f45', mapTypes: ['level'], effect: 'swamp' },

    { id: 4, label: 'Player Start', category: 'levelObject', color: '#26a05f', mapTypes: ['level'], unique: true, objectType: 'player_start' },
    { id: 5, label: 'Portal', category: 'object', color: '#6c4ad2', mapTypes: ['level', 'town'], objectType: 'portal' },
    { id: 6, label: 'Enemy Spawn', category: 'levelObject', color: '#8b5a2b', mapTypes: ['level'], objectType: 'enemy_spawn' },

    { id: 100, label: 'Blacksmith', category: 'townObject', color: '#b45309', mapTypes: ['town'], objectType: 'shop', shopType: 'blacksmith' },
    { id: 101, label: 'Armor Shop', category: 'townObject', color: '#7c3aed', mapTypes: ['town'], objectType: 'shop', shopType: 'armor' },
    { id: 102, label: 'Potion Shop', category: 'townObject', color: '#be185d', mapTypes: ['town'], objectType: 'shop', shopType: 'potion' },
    { id: 103, label: 'Special Shop', category: 'townObject', color: '#9333ea', mapTypes: ['town'], objectType: 'shop', shopType: 'special' },
    { id: 104, label: 'General Shop', category: 'townObject', color: '#0f766e', mapTypes: ['town'], objectType: 'shop', shopType: 'general' },
    { id: 105, label: 'Healing Fountain', category: 'townObject', color: '#0ea5e9', mapTypes: ['town'], unique: true, objectType: 'fountain' },
    { id: 106, label: 'NPC / Interaction', category: 'townObject', color: '#64748b', mapTypes: ['town'], objectType: 'interaction' },

    { id: 120, label: 'Chest Marker', category: 'specialObject', color: '#92400e', mapTypes: ['level'], objectType: 'special', specialType: 'chest' },
    { id: 121, label: 'Trigger Marker', category: 'specialObject', color: '#1d4ed8', mapTypes: ['level', 'town'], objectType: 'special', specialType: 'trigger' },
    { id: 122, label: 'Boss Marker', category: 'specialObject', color: '#991b1b', mapTypes: ['level'], objectType: 'special', specialType: 'boss' }
  ];

  const TILE_DEFS_BY_ID = buildTileDefinitionMap(TILE_DEFINITIONS);

  const dom = {
    gridContainer: document.getElementById('gridContainer'),
    palette: document.getElementById('palette'),
    eraserBtn: document.getElementById('eraserBtn'),
    paintToolBtn: document.getElementById('paintToolBtn'),
    fillToolBtn: document.getElementById('fillToolBtn'),
    selectedToolLabel: document.getElementById('selectedToolLabel'),
    activeToolLabel: document.getElementById('activeToolLabel'),
    mapTypeLabel: document.getElementById('mapTypeLabel'),
    mapIdLabel: document.getElementById('mapIdLabel'),
    gridSizeLabel: document.getElementById('gridSizeLabel'),
    gridSizeLabel2: document.getElementById('gridSizeLabel2'),
    message: document.getElementById('message'),
    tileLegend: document.getElementById('tileLegend'),
    exportBtn: document.getElementById('exportBtn'),
    exportGameBtn: document.getElementById('exportGameBtn'),
    importInput: document.getElementById('importInput'),
    clearBtn: document.getElementById('clearBtn'),
    openViewerBtn: document.getElementById('openViewerBtn'),
    mapTypeSelect: document.getElementById('mapTypeSelect'),
    mapIdInput: document.getElementById('mapIdInput'),
    mapNameInput: document.getElementById('mapNameInput'),
    mapWidthInput: document.getElementById('mapWidthInput'),
    mapHeightInput: document.getElementById('mapHeightInput'),
    applySizeBtn: document.getElementById('applySizeBtn')
  };

  const state = {
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    mapType: 'level',
    mapId: 'level_001',
    mapName: 'Starter Level',
    tiles: createEmptyTileGrid(DEFAULT_WIDTH, DEFAULT_HEIGHT),
    selectedTileId: 1,
    activeTool: 'paint',
    isPainting: false,
    lastPaintedCellKey: ''
  };

  initialize();

  function initialize() {
    renderPalette();
    renderLegend();
    renderGrid();
    bindEvents();
    setSelectedTile(1);
    updateActiveToolButtonState();
    syncMapInputsFromState();
    updateMapLabels();
    updateStatus('Ready. Click or drag on the grid to paint tiles.');
  }

  function buildTileDefinitionMap(definitions) {
    return definitions.reduce(function (acc, entry) {
      acc[entry.id] = entry;
      return acc;
    }, {});
  }

  function createEmptyTileGrid(width, height) {
    return Array.from({ length: height }, function () {
      return Array(width).fill(0);
    });
  }

  function cloneTiles(tiles) {
    return tiles.map(function (row) {
      return row.slice();
    });
  }

  function getVisiblePaletteDefinitions() {
    return TILE_DEFINITIONS.filter(function (tile) {
      return tile.mapTypes.indexOf(state.mapType) !== -1;
    });
  }

  function renderPalette() {
    const visibleTiles = getVisiblePaletteDefinitions();
    dom.palette.innerHTML = '';

    visibleTiles.forEach(function (tile) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tile-btn';
      btn.dataset.tileId = String(tile.id);
      btn.setAttribute('aria-label', 'Select tile ' + tile.label + ' (ID ' + tile.id + ')');

      const colorDot = document.createElement('span');
      colorDot.className = 'tile-color-dot';
      colorDot.style.background = tile.color;

      const text = document.createElement('span');
      text.textContent = tile.label + ' (' + tile.id + ')';

      btn.appendChild(colorDot);
      btn.appendChild(text);
      btn.addEventListener('click', function () {
        setSelectedTile(tile.id);
      });

      dom.palette.appendChild(btn);
    });

    highlightActivePaletteButton();
  }

  function renderLegend() {
    dom.tileLegend.innerHTML = '';

    getVisiblePaletteDefinitions().forEach(function (tile) {
      const li = document.createElement('li');
      li.textContent = tile.id + ' = ' + tile.label + ' [' + tile.category + ']';
      dom.tileLegend.appendChild(li);
    });
  }

  function renderGrid() {
    dom.gridContainer.innerHTML = '';
    dom.gridContainer.style.setProperty('--grid-width', String(state.width));
    dom.gridContainer.style.setProperty('--grid-height', String(state.height));

    for (let row = 0; row < state.height; row += 1) {
      for (let col = 0; col < state.width; col += 1) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = String(row);
        cell.dataset.col = String(col);
        setCellTileStyle(cell, state.tiles[row][col]);
        dom.gridContainer.appendChild(cell);
      }
    }

    dom.gridSizeLabel.textContent = String(state.width);
    dom.gridSizeLabel2.textContent = String(state.height);
  }

  function setCellTileStyle(cell, tileId) {
    cell.dataset.tileId = String(tileId);
    cell.style.backgroundColor = getTileColor(tileId);
  }

  function getTileColor(tileId) {
    if (Object.prototype.hasOwnProperty.call(TILE_DEFS_BY_ID, tileId)) {
      return TILE_DEFS_BY_ID[tileId].color;
    }
    return '#9ca3af';
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
      if (!state.isPainting || state.activeTool !== 'paint') {
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
      state.activeTool = 'paint';
      updateActiveToolButtonState();
    });

    dom.paintToolBtn.addEventListener('click', function () {
      state.activeTool = 'paint';
      updateActiveToolButtonState();
    });

    dom.fillToolBtn.addEventListener('click', function () {
      state.activeTool = 'fill';
      updateActiveToolButtonState();
    });

    dom.applySizeBtn.addEventListener('click', applySizeFromInputs);

    dom.mapTypeSelect.addEventListener('change', function () {
      state.mapType = dom.mapTypeSelect.value;
      renderPalette();
      renderLegend();
      ensureSelectedTileIsVisible();
      updateMapLabels();
      updateStatus('Map type set to ' + state.mapType + '.');
    });

    dom.mapIdInput.addEventListener('input', function () {
      state.mapId = normalizeMapId(dom.mapIdInput.value);
      updateMapLabels();
    });

    dom.mapNameInput.addEventListener('input', function () {
      state.mapName = dom.mapNameInput.value.trim() || 'Untitled Map';
    });

    dom.exportBtn.addEventListener('click', exportRawMapToFile);
    dom.exportGameBtn.addEventListener('click', exportEngineMapToFile);

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
      state.tiles = createEmptyTileGrid(state.width, state.height);
      renderGrid();
      updateStatus('Map cleared.');
    });

    dom.openViewerBtn.addEventListener('click', function () {
      const payload = serializeEngineMap();
      try {
        window.localStorage.setItem(STORAGE_PREVIEW_KEY, JSON.stringify(payload));
      } catch (storageError) {
        updateStatus('Could not save preview to localStorage: ' + storageError.message, true);
        return;
      }
      window.location.href = 'viewer.html';
    });
  }

  function updateMapLabels() {
    dom.mapTypeLabel.textContent = state.mapType;
    dom.mapIdLabel.textContent = state.mapId;
  }

  function syncMapInputsFromState() {
    dom.mapTypeSelect.value = state.mapType;
    dom.mapIdInput.value = state.mapId;
    dom.mapNameInput.value = state.mapName;
    dom.mapWidthInput.value = String(state.width);
    dom.mapHeightInput.value = String(state.height);
  }

  function normalizeMapId(inputValue) {
    const cleaned = String(inputValue || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_\-]/g, '_')
      .replace(/_+/g, '_');
    return cleaned || 'map_' + state.mapType;
  }

  function applySizeFromInputs() {
    const nextWidth = Number(dom.mapWidthInput.value);
    const nextHeight = Number(dom.mapHeightInput.value);

    if (!Number.isInteger(nextWidth) || !Number.isInteger(nextHeight) || nextWidth < 1 || nextHeight < 1) {
      updateStatus('Map width and height must be positive integers.', true);
      return;
    }

    if (nextWidth > MAX_MAP_SIDE || nextHeight > MAX_MAP_SIDE) {
      updateStatus('Map size limit is ' + MAX_MAP_SIDE + ' x ' + MAX_MAP_SIDE + '.', true);
      return;
    }

    resizeMap(nextWidth, nextHeight);
  }

  function resizeMap(nextWidth, nextHeight) {
    const oldWidth = state.width;
    const oldHeight = state.height;
    const nextTiles = createEmptyTileGrid(nextWidth, nextHeight);

    const copyHeight = Math.min(oldHeight, nextHeight);
    const copyWidth = Math.min(oldWidth, nextWidth);

    for (let row = 0; row < copyHeight; row += 1) {
      for (let col = 0; col < copyWidth; col += 1) {
        nextTiles[row][col] = state.tiles[row][col];
      }
    }

    state.width = nextWidth;
    state.height = nextHeight;
    state.tiles = nextTiles;

    renderGrid();
    syncMapInputsFromState();

    const actionText = nextWidth >= oldWidth && nextHeight >= oldHeight ? 'expanded' : 'resized';
    updateStatus('Map ' + actionText + ' to ' + nextWidth + ' x ' + nextHeight + '. Existing area preserved.');
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

    if (state.activeTool === 'fill') {
      applyFillAt(row, col, state.selectedTileId);
      renderGrid();
      updateStatus('Fill applied from (' + col + ', ' + row + ').');
      return;
    }

    const currentKey = row + ',' + col;
    if (state.lastPaintedCellKey === currentKey && state.isPainting) {
      return;
    }
    state.lastPaintedCellKey = currentKey;

    applyTileAt(row, col, state.selectedTileId);
    setCellTileStyle(cell, state.tiles[row][col]);
  }

  function applyFillAt(startRow, startCol, tileId) {
    const targetTileId = state.tiles[startRow][startCol];
    if (targetTileId === tileId) {
      return;
    }

    const queue = [[startRow, startCol]];
    const visited = new Set();

    while (queue.length > 0) {
      const current = queue.shift();
      const row = current[0];
      const col = current[1];
      const key = row + ',' + col;

      if (visited.has(key)) {
        continue;
      }
      visited.add(key);

      if (!isInsideMap(col, row) || state.tiles[row][col] !== targetTileId) {
        continue;
      }

      applyTileAt(row, col, tileId);

      queue.push([row - 1, col]);
      queue.push([row + 1, col]);
      queue.push([row, col - 1]);
      queue.push([row, col + 1]);
    }
  }

  function applyTileAt(row, col, tileId) {
    if (!isInsideMap(col, row)) {
      return;
    }

    const def = TILE_DEFS_BY_ID[tileId];
    if (def && def.unique) {
      clearExistingUniqueTile(tileId);
    }

    state.tiles[row][col] = tileId;
  }

  function isInsideMap(col, row) {
    return row >= 0 && row < state.height && col >= 0 && col < state.width;
  }

  function clearExistingUniqueTile(tileId) {
    for (let row = 0; row < state.height; row += 1) {
      for (let col = 0; col < state.width; col += 1) {
        if (state.tiles[row][col] === tileId) {
          state.tiles[row][col] = 0;
        }
      }
    }
  }

  function setSelectedTile(tileId) {
    state.selectedTileId = tileId;
    const tile = TILE_DEFS_BY_ID[tileId];
    const name = tile ? tile.label : 'Unknown';
    dom.selectedToolLabel.textContent = name + ' (ID ' + tileId + ')';
    highlightActivePaletteButton();
  }

  function ensureSelectedTileIsVisible() {
    const visibleIds = getVisiblePaletteDefinitions().map(function (tile) {
      return tile.id;
    });
    if (visibleIds.indexOf(state.selectedTileId) === -1) {
      setSelectedTile(0);
    }
  }

  function highlightActivePaletteButton() {
    const buttons = dom.palette.querySelectorAll('.tile-btn');
    buttons.forEach(function (btn) {
      const isSelected = Number(btn.dataset.tileId) === state.selectedTileId;
      btn.classList.toggle('active', isSelected);
    });
  }

  function updateActiveToolButtonState() {
    dom.paintToolBtn.classList.toggle('active', state.activeTool === 'paint');
    dom.fillToolBtn.classList.toggle('active', state.activeTool === 'fill');
    dom.activeToolLabel.textContent = state.activeTool === 'fill' ? 'Fill' : 'Paint';
  }

  function exportRawMapToFile() {
    const rawPayload = {
      gridSize: state.width === state.height ? state.width : undefined,
      width: state.width,
      height: state.height,
      mapType: state.mapType,
      mapId: state.mapId,
      mapName: state.mapName,
      tiles: cloneTiles(state.tiles)
    };

    if (rawPayload.gridSize === undefined) {
      delete rawPayload.gridSize;
    }

    downloadJsonFile(rawPayload, state.mapId + '_raw.json');
    updateStatus('Raw map JSON exported.');
  }

  function exportEngineMapToFile() {
    const payload = serializeEngineMap();
    downloadJsonFile(payload, state.mapId + '_engine.json');
    updateStatus('Engine-ready JSON exported.');
  }

  function serializeEngineMap() {
    const placements = collectPlacementsFromTiles();
    const tileMetadata = collectTileMetadata();

    return {
      formatVersion: 2,
      map: {
        id: state.mapId,
        name: state.mapName,
        type: state.mapType,
        width: state.width,
        height: state.height,
        tileset: 'default',
        textureMappingHint: 'Use tile ID mapping in engine texture packs.',
        tiles: cloneTiles(state.tiles),
        tileMetadata: tileMetadata,
        placements: placements,
        future: {
          npcSpawns: [],
          scriptedEvents: [],
          triggers: []
        }
      }
    };
  }

  function collectTileMetadata() {
    const metadata = [];
    for (let row = 0; row < state.height; row += 1) {
      for (let col = 0; col < state.width; col += 1) {
        const tileId = state.tiles[row][col];
        const def = TILE_DEFS_BY_ID[tileId];
        if (!def || !def.effect) {
          continue;
        }
        metadata.push({ x: col, y: row, effect: def.effect, tileId: tileId });
      }
    }
    return metadata;
  }

  function collectPlacementsFromTiles() {
    const placements = {
      playerStart: null,
      portals: [],
      enemySpawns: [],
      shops: [],
      fountains: [],
      specials: [],
      interactions: []
    };

    for (let row = 0; row < state.height; row += 1) {
      for (let col = 0; col < state.width; col += 1) {
        const tileId = state.tiles[row][col];
        const def = TILE_DEFS_BY_ID[tileId];
        if (!def || !def.objectType) {
          continue;
        }

        if (def.objectType === 'player_start') {
          placements.playerStart = { x: col, y: row };
        } else if (def.objectType === 'portal') {
          placements.portals.push({ x: col, y: row, targetMapId: '' });
        } else if (def.objectType === 'enemy_spawn') {
          placements.enemySpawns.push({ x: col, y: row, enemyGroupId: 'default_group' });
        } else if (def.objectType === 'shop') {
          placements.shops.push({ x: col, y: row, shopType: def.shopType || 'general' });
        } else if (def.objectType === 'fountain') {
          placements.fountains.push({ x: col, y: row, fountainType: 'healing' });
        } else if (def.objectType === 'special') {
          placements.specials.push({ x: col, y: row, specialType: def.specialType || 'marker' });
        } else if (def.objectType === 'interaction') {
          placements.interactions.push({ x: col, y: row, interactionType: 'npc_or_trigger' });
        }
      }
    }

    return placements;
  }

  function importMapFromFile(file) {
    const reader = new FileReader();

    reader.onload = function () {
      try {
        const parsed = JSON.parse(String(reader.result));
        const normalized = normalizeImportedPayload(parsed);
        applyImportedMap(normalized);
        updateStatus('Map imported successfully.');
      } catch (error) {
        updateStatus('Import failed: ' + error.message, true);
      }
    };

    reader.onerror = function () {
      updateStatus('Import failed: unable to read file.', true);
    };

    reader.readAsText(file);
  }

  function normalizeImportedPayload(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('JSON root must be an object.');
    }

    if (data.formatVersion === 2 && data.map) {
      return normalizeMapLikeObject(data.map, 'engine');
    }

    return normalizeMapLikeObject(data, 'raw');
  }

  function normalizeMapLikeObject(mapData, mode) {
    const width = Number.isInteger(mapData.width) ? mapData.width : Number.isInteger(mapData.gridSize) ? mapData.gridSize : null;
    const height = Number.isInteger(mapData.height) ? mapData.height : Number.isInteger(mapData.gridSize) ? mapData.gridSize : null;

    if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) {
      throw new Error('Map width and height must be positive integers.');
    }

    if (!Array.isArray(mapData.tiles) || mapData.tiles.length !== height) {
      throw new Error('tiles array must match map height.');
    }

    const normalizedTiles = mapData.tiles.map(function (row) {
      if (!Array.isArray(row) || row.length !== width) {
        throw new Error('each tile row must match map width.');
      }
      return row.map(function (tileId) {
        if (!Number.isInteger(tileId)) {
          throw new Error('tile IDs must be integers.');
        }
        return tileId;
      });
    });

    const inferredType = typeof mapData.type === 'string' ? mapData.type : mapData.mapType;

    return {
      width: width,
      height: height,
      mapType: inferredType === 'town' ? 'town' : 'level',
      mapId: normalizeMapId(mapData.id || mapData.mapId || (mode === 'engine' ? 'imported_engine_map' : 'imported_raw_map')),
      mapName: String(mapData.name || mapData.mapName || 'Imported Map'),
      tiles: normalizedTiles
    };
  }

  function applyImportedMap(normalized) {
    state.width = normalized.width;
    state.height = normalized.height;
    state.mapType = normalized.mapType;
    state.mapId = normalized.mapId;
    state.mapName = normalized.mapName;
    state.tiles = normalized.tiles;

    syncMapInputsFromState();
    updateMapLabels();
    renderPalette();
    renderLegend();
    ensureSelectedTileIsVisible();
    renderGrid();
  }

  function downloadJsonFile(payload, filename) {
    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
  }

  function updateStatus(text, isError) {
    dom.message.textContent = text;
    dom.message.style.color = isError ? '#b42318' : '#42556f';
  }
})();
