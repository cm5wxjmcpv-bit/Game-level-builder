(function () {
  'use strict';

  const DEFAULT_WIDTH = 30;
  const DEFAULT_HEIGHT = 30;
  const STORAGE_PREVIEW_KEY = 'levelBuilderPreviewMap';
  const MAX_MAP_SIDE = 200;
  const TEXTURE_COLORS = generateTextureColors();
  const TEXTURE_SIZES = [16, 32, 64];
  const ENGINE_TILE_IDS = {
    floor_grass_a: 'floor_grass_a',
    floor_grass_b: 'floor_grass_b',
    floor_stone_a: 'floor_stone_a',
    floor_stone_b: 'floor_stone_b',
    floor_dirt_a: 'floor_dirt_a',
    floor_dirt_b: 'floor_dirt_b',
    floor_sand_a: 'floor_sand_a',
    floor_wood_a: 'floor_wood_a',
    floor_marble_a: 'floor_marble_a',
    floor_ice_a: 'floor_ice_a',
    wall_rock_a: 'wall_rock_a',
    wall_rock_b: 'wall_rock_b',
    wall_brick_a: 'wall_brick_a',
    wall_brick_b: 'wall_brick_b',
    wall_wood_a: 'wall_wood_a',
    hazard_lava: 'hazard_lava',
    hazard_water: 'hazard_water',
    hazard_swamp: 'hazard_swamp',
    hazard_poison: 'hazard_poison',
    special_portal_pad: 'special_portal_pad'
  };

  // [UNCHANGED EXISTING TILE_IDS, OBJECT_IDS, and PALETTE_DEFINITIONS...]
  // Keep existing constants exactly as-is.
  // ...
  // (Full script remains same except additions below.)

  const LEGACY_ID_TO_TYPE = {
    0: TILE_IDS.empty,
    1: TILE_IDS.wall_stone,
    2: TILE_IDS.water,
    3: TILE_IDS.lava,
    4: OBJECT_IDS.player_start,
    5: OBJECT_IDS.portal_level,
    6: OBJECT_IDS.enemy_spawn_basic,
    7: TILE_IDS.bridge,
    10: TILE_IDS.floor_stone,
    11: TILE_IDS.floor_wood,
    12: TILE_IDS.floor_grass,
    13: TILE_IDS.floor_sand,
    21: TILE_IDS.swamp,
    100: OBJECT_IDS.blacksmith,
    101: OBJECT_IDS.armor_shop,
    102: OBJECT_IDS.potion_shop,
    103: OBJECT_IDS.special_shop,
    104: OBJECT_IDS.general_shop,
    105: OBJECT_IDS.fountain,
    106: OBJECT_IDS.npc_spot,
    120: OBJECT_IDS.chest_common,
    121: OBJECT_IDS.trigger_marker,
    122: OBJECT_IDS.enemy_spawn_boss
  };

  const DEFS_BY_ID = PALETTE_DEFINITIONS.reduce(function (acc, entry) {
    acc[entry.id] = entry;
    return acc;
  }, {});

  const dom = {
    gridContainer: document.getElementById('gridContainer'),
    palette: document.getElementById('palette'),
    eraserBtn: document.getElementById('eraserBtn'),
    paintToolBtn: document.getElementById('paintToolBtn'),
    fillToolBtn: document.getElementById('fillToolBtn'),
    layerTileBtn: document.getElementById('layerTileBtn'),
    layerObjectBtn: document.getElementById('layerObjectBtn'),
    selectedToolLabel: document.getElementById('selectedToolLabel'),
    activeToolLabel: document.getElementById('activeToolLabel'),
    activeLayerLabel: document.getElementById('activeLayerLabel'),
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
    applySizeBtn: document.getElementById('applySizeBtn'),
    tabMapEditorBtn: document.getElementById('tabMapEditorBtn'),
    tabViewerBtn: document.getElementById('tabViewerBtn'),
    tabItemEditorBtn: document.getElementById('tabItemEditorBtn'),
    tabTextureBuilderBtn: document.getElementById('tabTextureBuilderBtn'),
    mapEditorTab: document.getElementById('mapEditorTab'),
    viewerTab: document.getElementById('viewerTab'),
    itemEditorTab: document.getElementById('itemEditorTab'),
    textureBuilderTab: document.getElementById('textureBuilderTab'),
    openViewerFromTabBtn: document.getElementById('openViewerFromTabBtn'),
    itemList: document.getElementById('itemList'),
    itemEditorMessage: document.getElementById('itemEditorMessage'),
    itemNewBtn: document.getElementById('itemNewBtn'),
    itemSaveBtn: document.getElementById('itemSaveBtn'),
    itemDeleteBtn: document.getElementById('itemDeleteBtn'),
    itemExportBtn: document.getElementById('itemExportBtn'),
    itemImportInput: document.getElementById('itemImportInput'),
    itemIdInput: document.getElementById('itemIdInput'),
    itemNameInput: document.getElementById('itemNameInput'),
    itemCategorySelect: document.getElementById('itemCategorySelect'),
    itemBaseValueInput: document.getElementById('itemBaseValueInput'),
    itemStackableInput: document.getElementById('itemStackableInput'),
    itemRaritySelect: document.getElementById('itemRaritySelect'),
    itemEquipSlotInput: document.getElementById('itemEquipSlotInput'),
    itemModsInput: document.getElementById('itemModsInput'),
    itemPowerInput: document.getElementById('itemPowerInput'),
    itemAttackRangeInput: document.getElementById('itemAttackRangeInput'),
    itemCooldownInput: document.getElementById('itemCooldownInput'),
    itemEffectTypeInput: document.getElementById('itemEffectTypeInput'),
    itemEffectValueInput: document.getElementById('itemEffectValueInput'),
    itemEffectDurationInput: document.getElementById('itemEffectDurationInput'),
    equipSlotRow: document.getElementById('equipSlotRow'),
    modsRow: document.getElementById('modsRow'),
    weaponFields: document.getElementById('weaponFields'),
    consumableFields: document.getElementById('consumableFields'),
    textureSizeSelect: document.getElementById('textureSizeSelect'),
    texturePalette: document.getElementById('texturePalette'),
    texturePaintToolBtn: document.getElementById('texturePaintToolBtn'),
    textureFillToolBtn: document.getElementById('textureFillToolBtn'),
    textureEraserBtn: document.getElementById('textureEraserBtn'),
    textureExportBtn: document.getElementById('textureExportBtn'),
    textureGridContainer: document.getElementById('textureGridContainer'),
    textureSizeLabel: document.getElementById('textureSizeLabel'),
    textureSizeLabel2: document.getElementById('textureSizeLabel2'),
    textureSelectedColorLabel: document.getElementById('textureSelectedColorLabel'),
    textureActiveToolLabel: document.getElementById('textureActiveToolLabel'),
    textureMessage: document.getElementById('textureMessage'),
    textureColorPicker: document.getElementById('textureColorPicker')
  };

  const state = {
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    mapType: 'level',
    mapId: 'level_001',
    mapName: 'Starter Level',
    tileLayer: createLayerGrid(DEFAULT_WIDTH, DEFAULT_HEIGHT, TILE_IDS.empty),
    objectLayer: createLayerGrid(DEFAULT_WIDTH, DEFAULT_HEIGHT, OBJECT_IDS.none),
    selectedByLayer: {
      tile: ENGINE_TILE_IDS.floor_stone_a,
      object: OBJECT_IDS.player_start
    },
    activeLayer: 'tile',
    activeTool: 'paint',
    isPainting: false,
    lastPaintedCellKey: '',
    activeTab: 'mapEditor',
    itemDb: { items: [] },
    selectedItemIndex: -1,
    textureBuilder: {
      size: 16,
      pixels: createLayerGrid(16, 16, null),
      selectedColor: '#000000',
      activeTool: 'paint',
      isPainting: false,
      lastPaintedCellKey: ''
    }
  };

  initialize();

  function initialize() {
    renderPalette();
    renderLegend();
    renderGrid();
    bindEvents();
    updateActiveLayerButtons();
    updateActiveToolButtonState();
    syncMapInputsFromState();
    updateMapLabels();
    updateSelectedToolLabel();
    renderItemList();
    resetItemFormToDefaults();
    updateItemConditionalFields();
    initializeTextureBuilder();
    updateStatus('Ready. Click or drag on the grid to paint tiles and markers.');
  }

  function createLayerGrid(width, height, value) {
    return Array.from({ length: height }, function () {
      return Array(width).fill(value);
    });
  }

  function generateTextureColors() {
    const colors = [];
    for (let h = 0; h < 360; h += 12) {
      for (let s = 55; s <= 85; s += 15) {
        for (let l = 30; l <= 70; l += 10) {
          colors.push('hsl(' + h + ', ' + s + '%, ' + l + '%)');
        }
      }
    }
    colors.push('#000000');
    colors.push('#ffffff');
    colors.push(null);
    return colors;
  }

  // ... all existing logic remains unchanged ...

  function bindEvents() {
    // existing map/editor/viewer/item handlers unchanged

    // texture handlers unchanged except color picker listener below
    dom.textureGridContainer.addEventListener('mousedown', function (event) {
      const cell = getTextureCellFromEventTarget(event.target);
      if (!cell) {
        return;
      }
      event.preventDefault();
      state.textureBuilder.isPainting = true;
      state.textureBuilder.lastPaintedCellKey = '';
      paintTextureCellFromElement(cell);
    });

    dom.textureGridContainer.addEventListener('mouseover', function (event) {
      if (!state.textureBuilder.isPainting || state.textureBuilder.activeTool !== 'paint') {
        return;
      }
      const cell = getTextureCellFromEventTarget(event.target);
      if (!cell) {
        return;
      }
      paintTextureCellFromElement(cell);
    });

    dom.textureGridContainer.addEventListener('click', function (event) {
      const cell = getTextureCellFromEventTarget(event.target);
      if (!cell) {
        return;
      }
      paintTextureCellFromElement(cell);
    });

    document.addEventListener('mouseup', function () {
      state.textureBuilder.isPainting = false;
      state.textureBuilder.lastPaintedCellKey = '';
    });

    dom.textureSizeSelect.addEventListener('change', function () {
      const nextSize = Number(dom.textureSizeSelect.value);
      if (TEXTURE_SIZES.indexOf(nextSize) === -1) {
        return;
      }
      state.textureBuilder.size = nextSize;
      state.textureBuilder.pixels = createLayerGrid(nextSize, nextSize, null);
      renderTextureGrid();
      updateTextureStatus('Texture grid reset to ' + nextSize + ' x ' + nextSize + '.');
    });

    dom.texturePaintToolBtn.addEventListener('click', function () {
      state.textureBuilder.activeTool = 'paint';
      updateTextureToolButtonState();
    });

    dom.textureFillToolBtn.addEventListener('click', function () {
      state.textureBuilder.activeTool = 'fill';
      updateTextureToolButtonState();
    });

    dom.textureEraserBtn.addEventListener('click', function () {
      state.textureBuilder.selectedColor = null;
      state.textureBuilder.activeTool = 'paint';
      highlightActiveTexturePaletteButton();
      updateTextureToolButtonState();
      updateTextureStatus('Eraser selected.');
    });

    dom.textureColorPicker.addEventListener('input', function () {
      state.textureBuilder.selectedColor = dom.textureColorPicker.value;
      highlightActiveTexturePaletteButton();
    });

    dom.textureExportBtn.addEventListener('click', exportTextureToFile);
  }

  function initializeTextureBuilder() {
    dom.textureSizeSelect.value = String(state.textureBuilder.size);
    dom.textureColorPicker.value = '#000000';
    renderTexturePalette();
    renderTextureGrid();
    updateTextureToolButtonState();
    updateTextureStatus('Texture Builder ready.');
  }

  // ... unchanged existing rendering/edit/export/import functions ...

})();
