(function () {
  'use strict';

  const DEFAULT_WIDTH = 30;
  const DEFAULT_HEIGHT = 30;
  const STORAGE_PREVIEW_KEY = 'levelBuilderPreviewMap';
  const MAX_MAP_SIDE = 200;
  const TEXTURE_COLORS = ['#000000', '#ffffff', '#ef4444', '#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#06b6d4', null];
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

  const TILE_IDS = {
    empty: 'empty',
    floor_stone: 'floor_stone',
    floor_wood: 'floor_wood',
    floor_grass: 'floor_grass',
    floor_sand: 'floor_sand',
    floor_dirt: 'floor_dirt',
    floor_cobble: 'floor_cobble',
    floor_tile: 'floor_tile',
    floor_moss: 'floor_moss',
    floor_snow: 'floor_snow',
    floor_ash: 'floor_ash',
    floor_crystal: 'floor_crystal',
    floor_darkstone: 'floor_darkstone',
    floor_marble: 'floor_marble',
    floor_ruins: 'floor_ruins',
    floor_planks: 'floor_planks',
    wall_stone: 'wall_stone',
    wall_wood: 'wall_wood',
    wall_brick: 'wall_brick',
    wall_metal: 'wall_metal',
    wall_ruin: 'wall_ruin',
    cliff: 'cliff',
    tree_block: 'tree_block',
    rock_block: 'rock_block',
    fence: 'fence',
    gate_closed: 'gate_closed',
    gate_open: 'gate_open',
    breakable_wall: 'breakable_wall',
    secret_wall: 'secret_wall',
    cave_wall: 'cave_wall',
    castle_wall: 'castle_wall',
    lava: 'lava',
    water: 'water',
    swamp: 'swamp',
    poison: 'poison',
    acid: 'acid',
    spikes: 'spikes',
    fire_trap: 'fire_trap',
    ice: 'ice',
    mud: 'mud',
    quicksand: 'quicksand',
    cursed_ground: 'cursed_ground',
    electric_floor: 'electric_floor',
    thorn_patch: 'thorn_patch',
    healing_pool: 'healing_pool',
    slow_field: 'slow_field',
    bridge: 'bridge',
    stairs_up: 'stairs_up',
    stairs_down: 'stairs_down',
    ladder: 'ladder',
    jump_pad: 'jump_pad',
    narrow_path: 'narrow_path',
    doorway: 'doorway',
    tunnel_entry: 'tunnel_entry',
    tunnel_exit: 'tunnel_exit',
    one_way_gate: 'one_way_gate'
  };

  const OBJECT_IDS = {
    none: 'none',
    player_start: 'player_start',
    respawn_point: 'respawn_point',
    checkpoint: 'checkpoint',
    portal_level: 'portal_level',
    portal_town: 'portal_town',
    portal_world: 'portal_world',
    exit_marker: 'exit_marker',
    return_portal: 'return_portal',
    boss_exit: 'boss_exit',
    locked_portal: 'locked_portal',
    enemy_spawn_basic: 'enemy_spawn_basic',
    enemy_spawn_ranged: 'enemy_spawn_ranged',
    enemy_spawn_tank: 'enemy_spawn_tank',
    enemy_spawn_swarm: 'enemy_spawn_swarm',
    enemy_spawn_runner: 'enemy_spawn_runner',
    enemy_spawn_elite: 'enemy_spawn_elite',
    enemy_spawn_boss: 'enemy_spawn_boss',
    enemy_patrol_point: 'enemy_patrol_point',
    enemy_zone_start: 'enemy_zone_start',
    enemy_zone_end: 'enemy_zone_end',
    ambush_spawn: 'ambush_spawn',
    chest_common: 'chest_common',
    chest_rare: 'chest_rare',
    chest_legendary: 'chest_legendary',
    loot_drop_spot: 'loot_drop_spot',
    resource_node: 'resource_node',
    hidden_cache: 'hidden_cache',
    reward_marker: 'reward_marker',
    breakable_loot: 'breakable_loot',
    boss_reward: 'boss_reward',
    gold_pile: 'gold_pile',
    fountain: 'fountain',
    blacksmith: 'blacksmith',
    armor_shop: 'armor_shop',
    potion_shop: 'potion_shop',
    general_shop: 'general_shop',
    special_shop: 'special_shop',
    inn: 'inn',
    storage: 'storage',
    crafting_station: 'crafting_station',
    npc_spot: 'npc_spot',
    signpost: 'signpost',
    town_portal: 'town_portal',
    quest_board: 'quest_board',
    map_board: 'map_board',
    town_decor: 'town_decor',
    trigger_marker: 'trigger_marker',
    story_trigger: 'story_trigger',
    cutscene_trigger: 'cutscene_trigger',
    dialogue_trigger: 'dialogue_trigger',
    area_enter_trigger: 'area_enter_trigger',
    boss_trigger: 'boss_trigger',
    trap_trigger: 'trap_trigger',
    wave_trigger: 'wave_trigger',
    unlock_trigger: 'unlock_trigger',
    secret_trigger: 'secret_trigger',
    tree: 'tree',
    rock: 'rock',
    bush: 'bush',
    torch: 'torch',
    banner: 'banner',
    statue: 'statue',
    rubble: 'rubble',
    crate: 'crate',
    barrel: 'barrel',
    table: 'table',
    chair: 'chair',
    pillar: 'pillar',
    bones: 'bones',
    skull_pile: 'skull_pile',
    campfire: 'campfire'
  };

  const PALETTE_DEFINITIONS = [
    { id: ENGINE_TILE_IDS.floor_stone_a, label: 'Engine Floor Stone A', layer: 'tile', group: 'Engine Core Tiles', color: '#d3be95', mapTypes: ['level', 'town'] },
    { id: ENGINE_TILE_IDS.floor_grass_a, label: 'Engine Floor Grass A', layer: 'tile', group: 'Engine Core Tiles', color: '#9ac8b4', mapTypes: ['level', 'town'] },
    { id: ENGINE_TILE_IDS.wall_rock_a, label: 'Engine Wall Rock A', layer: 'tile', group: 'Engine Core Tiles', color: '#4c5563', mapTypes: ['level', 'town'] },
    { id: ENGINE_TILE_IDS.hazard_water, label: 'Engine Hazard Water', layer: 'tile', group: 'Engine Core Tiles', color: '#2a78c8', mapTypes: ['level', 'town'] },
    { id: ENGINE_TILE_IDS.special_portal_pad, label: 'Engine Special Portal Pad', layer: 'tile', group: 'Engine Core Tiles', color: '#8f6a3b', mapTypes: ['level', 'town'] },

    { id: TILE_IDS.empty, label: 'Empty', layer: 'tile', group: 'Floors', color: '#e9edf3', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.floor_stone, label: 'Floor Stone', layer: 'tile', group: 'Floors', color: '#d3be95', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.floor_wood, label: 'Floor Wood', layer: 'tile', group: 'Floors', color: '#c4b0e2', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.floor_grass, label: 'Floor Grass', layer: 'tile', group: 'Floors', color: '#9ac8b4', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.floor_sand, label: 'Floor Sand', layer: 'tile', group: 'Floors', color: '#ebd089', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.floor_dirt, label: 'Floor Dirt', layer: 'tile', group: 'Floors', color: '#96724f', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.floor_cobble, label: 'Floor Cobble', layer: 'tile', group: 'Floors', color: '#a5a9b2', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.floor_tile, label: 'Floor Tile', layer: 'tile', group: 'Floors', color: '#cbd5e1', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.floor_moss, label: 'Floor Moss', layer: 'tile', group: 'Floors', color: '#5f8a47', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.floor_snow, label: 'Floor Snow', layer: 'tile', group: 'Floors', color: '#f4f8fd', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.floor_ash, label: 'Floor Ash', layer: 'tile', group: 'Floors', color: '#7c7d86', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.floor_crystal, label: 'Floor Crystal', layer: 'tile', group: 'Floors', color: '#76cff2', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.floor_darkstone, label: 'Floor Darkstone', layer: 'tile', group: 'Floors', color: '#4b5563', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.floor_marble, label: 'Floor Marble', layer: 'tile', group: 'Floors', color: '#e2e8f0', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.floor_ruins, label: 'Floor Ruins', layer: 'tile', group: 'Floors', color: '#8f8378', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.floor_planks, label: 'Floor Planks', layer: 'tile', group: 'Floors', color: '#9f7851', mapTypes: ['level', 'town'] },

    { id: TILE_IDS.wall_stone, label: 'Wall Stone', layer: 'tile', group: 'Walls / Blockers', color: '#4c5563', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.wall_wood, label: 'Wall Wood', layer: 'tile', group: 'Walls / Blockers', color: '#6b4a2f', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.wall_brick, label: 'Wall Brick', layer: 'tile', group: 'Walls / Blockers', color: '#994b3f', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.wall_metal, label: 'Wall Metal', layer: 'tile', group: 'Walls / Blockers', color: '#7b8795', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.wall_ruin, label: 'Wall Ruin', layer: 'tile', group: 'Walls / Blockers', color: '#7d7468', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.cliff, label: 'Cliff', layer: 'tile', group: 'Walls / Blockers', color: '#5f564c', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.tree_block, label: 'Tree Block', layer: 'tile', group: 'Walls / Blockers', color: '#2f6f3f', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.rock_block, label: 'Rock Block', layer: 'tile', group: 'Walls / Blockers', color: '#5d6471', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.fence, label: 'Fence', layer: 'tile', group: 'Walls / Blockers', color: '#8e6b3b', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.gate_closed, label: 'Gate Closed', layer: 'tile', group: 'Walls / Blockers', color: '#624737', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.gate_open, label: 'Gate Open', layer: 'tile', group: 'Walls / Blockers', color: '#9f8468', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.breakable_wall, label: 'Breakable Wall', layer: 'tile', group: 'Walls / Blockers', color: '#b26b52', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.secret_wall, label: 'Secret Wall', layer: 'tile', group: 'Walls / Blockers', color: '#444f63', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.cave_wall, label: 'Cave Wall', layer: 'tile', group: 'Walls / Blockers', color: '#3f3b38', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.castle_wall, label: 'Castle Wall', layer: 'tile', group: 'Walls / Blockers', color: '#707b8d', mapTypes: ['level', 'town'] },

    { id: TILE_IDS.lava, label: 'Lava', layer: 'tile', group: 'Hazards / Effects', color: '#e65032', effect: 'lava', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.water, label: 'Water', layer: 'tile', group: 'Hazards / Effects', color: '#2a78c8', effect: 'water', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.swamp, label: 'Swamp', layer: 'tile', group: 'Hazards / Effects', color: '#5e7f45', effect: 'swamp', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.poison, label: 'Poison', layer: 'tile', group: 'Hazards / Effects', color: '#4d9c34', effect: 'poison', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.acid, label: 'Acid', layer: 'tile', group: 'Hazards / Effects', color: '#b7cf2f', effect: 'acid', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.spikes, label: 'Spikes', layer: 'tile', group: 'Hazards / Effects', color: '#8c95a4', effect: 'spikes', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.fire_trap, label: 'Fire Trap', layer: 'tile', group: 'Hazards / Effects', color: '#d3572d', effect: 'fire_trap', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.ice, label: 'Ice', layer: 'tile', group: 'Hazards / Effects', color: '#a5d8ee', effect: 'ice', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.mud, label: 'Mud', layer: 'tile', group: 'Hazards / Effects', color: '#816247', effect: 'mud', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.quicksand, label: 'Quicksand', layer: 'tile', group: 'Hazards / Effects', color: '#d2b777', effect: 'quicksand', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.cursed_ground, label: 'Cursed Ground', layer: 'tile', group: 'Hazards / Effects', color: '#60307a', effect: 'cursed_ground', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.electric_floor, label: 'Electric Floor', layer: 'tile', group: 'Hazards / Effects', color: '#58c4ff', effect: 'electric_floor', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.thorn_patch, label: 'Thorn Patch', layer: 'tile', group: 'Hazards / Effects', color: '#43743f', effect: 'thorn_patch', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.healing_pool, label: 'Healing Pool', layer: 'tile', group: 'Hazards / Effects', color: '#4ca8ac', effect: 'healing_pool', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.slow_field, label: 'Slow Field', layer: 'tile', group: 'Hazards / Effects', color: '#6f8ea2', effect: 'slow_field', mapTypes: ['level', 'town'] },

    { id: TILE_IDS.bridge, label: 'Bridge', layer: 'tile', group: 'Travel / Movement', color: '#8f6a3b', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.stairs_up, label: 'Stairs Up', layer: 'tile', group: 'Travel / Movement', color: '#8ba5c7', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.stairs_down, label: 'Stairs Down', layer: 'tile', group: 'Travel / Movement', color: '#6f84a2', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.ladder, label: 'Ladder', layer: 'tile', group: 'Travel / Movement', color: '#af8f4f', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.jump_pad, label: 'Jump Pad', layer: 'tile', group: 'Travel / Movement', color: '#ce5d9f', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.narrow_path, label: 'Narrow Path', layer: 'tile', group: 'Travel / Movement', color: '#6f8261', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.doorway, label: 'Doorway', layer: 'tile', group: 'Travel / Movement', color: '#5c3a2d', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.tunnel_entry, label: 'Tunnel Entry', layer: 'tile', group: 'Travel / Movement', color: '#4d5b6d', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.tunnel_exit, label: 'Tunnel Exit', layer: 'tile', group: 'Travel / Movement', color: '#7d8ca2', mapTypes: ['level', 'town'] },
    { id: TILE_IDS.one_way_gate, label: 'One Way Gate', layer: 'tile', group: 'Travel / Movement', color: '#7c5d5d', mapTypes: ['level', 'town'] },

    { id: OBJECT_IDS.none, label: 'None', layer: 'object', group: 'Player / Portals', color: '#ffffff', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.player_start, label: 'Player Start', layer: 'object', group: 'Player / Portals', color: '#22c55e', unique: true, mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.respawn_point, label: 'Respawn Point', layer: 'object', group: 'Player / Portals', color: '#84cc16', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.checkpoint, label: 'Checkpoint', layer: 'object', group: 'Player / Portals', color: '#65a30d', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.portal_level, label: 'Portal Level', layer: 'object', group: 'Player / Portals', color: '#6c4ad2', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.portal_town, label: 'Portal Town', layer: 'object', group: 'Player / Portals', color: '#7c3aed', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.portal_world, label: 'Portal World', layer: 'object', group: 'Player / Portals', color: '#8b5cf6', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.exit_marker, label: 'Exit Marker', layer: 'object', group: 'Player / Portals', color: '#1d4ed8', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.return_portal, label: 'Return Portal', layer: 'object', group: 'Player / Portals', color: '#a855f7', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.boss_exit, label: 'Boss Exit', layer: 'object', group: 'Player / Portals', color: '#581c87', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.locked_portal, label: 'Locked Portal', layer: 'object', group: 'Player / Portals', color: '#312e81', mapTypes: ['level', 'town'] },

    { id: OBJECT_IDS.enemy_spawn_basic, label: 'Enemy Spawn Basic', layer: 'object', group: 'Enemies', color: '#8b5a2b', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.enemy_spawn_ranged, label: 'Enemy Spawn Ranged', layer: 'object', group: 'Enemies', color: '#92400e', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.enemy_spawn_tank, label: 'Enemy Spawn Tank', layer: 'object', group: 'Enemies', color: '#7c2d12', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.enemy_spawn_swarm, label: 'Enemy Spawn Swarm', layer: 'object', group: 'Enemies', color: '#a16207', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.enemy_spawn_runner, label: 'Enemy Spawn Runner', layer: 'object', group: 'Enemies', color: '#b45309', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.enemy_spawn_elite, label: 'Enemy Spawn Elite', layer: 'object', group: 'Enemies', color: '#c2410c', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.enemy_spawn_boss, label: 'Enemy Spawn Boss', layer: 'object', group: 'Enemies', color: '#991b1b', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.enemy_patrol_point, label: 'Enemy Patrol Point', layer: 'object', group: 'Enemies', color: '#b91c1c', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.enemy_zone_start, label: 'Enemy Zone Start', layer: 'object', group: 'Enemies', color: '#dc2626', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.enemy_zone_end, label: 'Enemy Zone End', layer: 'object', group: 'Enemies', color: '#ef4444', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.ambush_spawn, label: 'Ambush Spawn', layer: 'object', group: 'Enemies', color: '#7f1d1d', mapTypes: ['level', 'town'] },

    { id: OBJECT_IDS.chest_common, label: 'Chest Common', layer: 'object', group: 'Loot / Rewards', color: '#92400e', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.chest_rare, label: 'Chest Rare', layer: 'object', group: 'Loot / Rewards', color: '#1d4ed8', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.chest_legendary, label: 'Chest Legendary', layer: 'object', group: 'Loot / Rewards', color: '#f59e0b', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.loot_drop_spot, label: 'Loot Drop Spot', layer: 'object', group: 'Loot / Rewards', color: '#ca8a04', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.resource_node, label: 'Resource Node', layer: 'object', group: 'Loot / Rewards', color: '#15803d', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.hidden_cache, label: 'Hidden Cache', layer: 'object', group: 'Loot / Rewards', color: '#78350f', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.reward_marker, label: 'Reward Marker', layer: 'object', group: 'Loot / Rewards', color: '#a16207', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.breakable_loot, label: 'Breakable Loot', layer: 'object', group: 'Loot / Rewards', color: '#9a3412', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.boss_reward, label: 'Boss Reward', layer: 'object', group: 'Loot / Rewards', color: '#92400e', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.gold_pile, label: 'Gold Pile', layer: 'object', group: 'Loot / Rewards', color: '#d97706', mapTypes: ['level', 'town'] },

    { id: OBJECT_IDS.fountain, label: 'Fountain', layer: 'object', group: 'Town', color: '#0ea5e9', mapTypes: ['town', 'level'] },
    { id: OBJECT_IDS.blacksmith, label: 'Blacksmith', layer: 'object', group: 'Town', color: '#b45309', mapTypes: ['town'] },
    { id: OBJECT_IDS.armor_shop, label: 'Armor Shop', layer: 'object', group: 'Town', color: '#7c3aed', mapTypes: ['town'] },
    { id: OBJECT_IDS.potion_shop, label: 'Potion Shop', layer: 'object', group: 'Town', color: '#be185d', mapTypes: ['town'] },
    { id: OBJECT_IDS.general_shop, label: 'General Shop', layer: 'object', group: 'Town', color: '#0f766e', mapTypes: ['town'] },
    { id: OBJECT_IDS.special_shop, label: 'Special Shop', layer: 'object', group: 'Town', color: '#9333ea', mapTypes: ['town'] },
    { id: OBJECT_IDS.inn, label: 'Inn', layer: 'object', group: 'Town', color: '#334155', mapTypes: ['town'] },
    { id: OBJECT_IDS.storage, label: 'Storage', layer: 'object', group: 'Town', color: '#64748b', mapTypes: ['town'] },
    { id: OBJECT_IDS.crafting_station, label: 'Crafting Station', layer: 'object', group: 'Town', color: '#52525b', mapTypes: ['town'] },
    { id: OBJECT_IDS.npc_spot, label: 'NPC Spot', layer: 'object', group: 'Town', color: '#4b5563', mapTypes: ['town'] },
    { id: OBJECT_IDS.signpost, label: 'Signpost', layer: 'object', group: 'Town', color: '#854d0e', mapTypes: ['town'] },
    { id: OBJECT_IDS.town_portal, label: 'Town Portal', layer: 'object', group: 'Town', color: '#6d28d9', mapTypes: ['town'] },
    { id: OBJECT_IDS.quest_board, label: 'Quest Board', layer: 'object', group: 'Town', color: '#1d4ed8', mapTypes: ['town'] },
    { id: OBJECT_IDS.map_board, label: 'Map Board', layer: 'object', group: 'Town', color: '#0c4a6e', mapTypes: ['town'] },
    { id: OBJECT_IDS.town_decor, label: 'Town Decor', layer: 'object', group: 'Town', color: '#57534e', mapTypes: ['town'] },

    { id: OBJECT_IDS.trigger_marker, label: 'Trigger Marker', layer: 'object', group: 'Triggers / Events', color: '#1d4ed8', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.story_trigger, label: 'Story Trigger', layer: 'object', group: 'Triggers / Events', color: '#2563eb', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.cutscene_trigger, label: 'Cutscene Trigger', layer: 'object', group: 'Triggers / Events', color: '#1e40af', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.dialogue_trigger, label: 'Dialogue Trigger', layer: 'object', group: 'Triggers / Events', color: '#3730a3', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.area_enter_trigger, label: 'Area Enter Trigger', layer: 'object', group: 'Triggers / Events', color: '#0c4a6e', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.boss_trigger, label: 'Boss Trigger', layer: 'object', group: 'Triggers / Events', color: '#991b1b', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.trap_trigger, label: 'Trap Trigger', layer: 'object', group: 'Triggers / Events', color: '#b91c1c', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.wave_trigger, label: 'Wave Trigger', layer: 'object', group: 'Triggers / Events', color: '#be123c', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.unlock_trigger, label: 'Unlock Trigger', layer: 'object', group: 'Triggers / Events', color: '#4f46e5', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.secret_trigger, label: 'Secret Trigger', layer: 'object', group: 'Triggers / Events', color: '#6d28d9', mapTypes: ['level', 'town'] },

    { id: OBJECT_IDS.tree, label: 'Tree', layer: 'object', group: 'Decor', color: '#166534', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.rock, label: 'Rock', layer: 'object', group: 'Decor', color: '#6b7280', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.bush, label: 'Bush', layer: 'object', group: 'Decor', color: '#15803d', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.torch, label: 'Torch', layer: 'object', group: 'Decor', color: '#f97316', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.banner, label: 'Banner', layer: 'object', group: 'Decor', color: '#7c3aed', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.statue, label: 'Statue', layer: 'object', group: 'Decor', color: '#64748b', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.rubble, label: 'Rubble', layer: 'object', group: 'Decor', color: '#78716c', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.crate, label: 'Crate', layer: 'object', group: 'Decor', color: '#92400e', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.barrel, label: 'Barrel', layer: 'object', group: 'Decor', color: '#a16207', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.table, label: 'Table', layer: 'object', group: 'Decor', color: '#854d0e', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.chair, label: 'Chair', layer: 'object', group: 'Decor', color: '#713f12', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.pillar, label: 'Pillar', layer: 'object', group: 'Decor', color: '#475569', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.bones, label: 'Bones', layer: 'object', group: 'Decor', color: '#d4d4d8', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.skull_pile, label: 'Skull Pile', layer: 'object', group: 'Decor', color: '#e5e7eb', mapTypes: ['level', 'town'] },
    { id: OBJECT_IDS.campfire, label: 'Campfire', layer: 'object', group: 'Decor', color: '#ea580c', mapTypes: ['level', 'town'] }
  ];

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
    textureColorPicker: document.getElementById('textureColorPicker'),
    texturePalette: document.getElementById('texturePalette'),
    texturePaintToolBtn: document.getElementById('texturePaintToolBtn'),
    textureFillToolBtn: document.getElementById('textureFillToolBtn'),
    textureEraserBtn: document.getElementById('textureEraserBtn'),
    textureFilenameInput: document.getElementById('textureFilenameInput'),
    textureExportBtn: document.getElementById('textureExportBtn'),
    textureExportPngBtn: document.getElementById('textureExportPngBtn'),
    textureExportEngineEntryBtn: document.getElementById('textureExportEngineEntryBtn'),
    textureGridContainer: document.getElementById('textureGridContainer'),
    textureSizeLabel: document.getElementById('textureSizeLabel'),
    textureSizeLabel2: document.getElementById('textureSizeLabel2'),
    textureSelectedColorLabel: document.getElementById('textureSelectedColorLabel'),
    textureActiveToolLabel: document.getElementById('textureActiveToolLabel'),
    textureMessage: document.getElementById('textureMessage')
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

  function cloneLayer(layer) {
    return layer.map(function (row) {
      return row.slice();
    });
  }

  function getVisiblePaletteDefinitions() {
    return PALETTE_DEFINITIONS.filter(function (def) {
      return def.layer === state.activeLayer && def.mapTypes.indexOf(state.mapType) !== -1;
    });
  }

  function renderPalette() {
    const visible = getVisiblePaletteDefinitions();
    const grouped = visible.reduce(function (acc, entry) {
      if (!acc[entry.group]) {
        acc[entry.group] = [];
      }
      acc[entry.group].push(entry);
      return acc;
    }, {});

    dom.palette.innerHTML = '';

    Object.keys(grouped).forEach(function (groupName, index) {
      const section = document.createElement('details');
      section.className = 'palette-group';
      if (index === 0) {
        section.open = true;
      }

      const summary = document.createElement('summary');
      summary.textContent = groupName;
      section.appendChild(summary);

      const groupGrid = document.createElement('div');
      groupGrid.className = 'palette';

      grouped[groupName].forEach(function (entry) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tile-btn';
        btn.dataset.tileId = entry.id;

        const colorDot = document.createElement('span');
        colorDot.className = 'tile-color-dot';
        colorDot.style.background = entry.color;

        const text = document.createElement('span');
        text.textContent = entry.label;

        btn.appendChild(colorDot);
        btn.appendChild(text);
        btn.addEventListener('click', function () {
          setSelectedForActiveLayer(entry.id);
        });
        groupGrid.appendChild(btn);
      });

      section.appendChild(groupGrid);
      dom.palette.appendChild(section);
    });

    highlightActivePaletteButton();
  }

  function renderLegend() {
    dom.tileLegend.innerHTML = '';
    PALETTE_DEFINITIONS.filter(function (entry) {
      return entry.mapTypes.indexOf(state.mapType) !== -1;
    }).forEach(function (entry) {
      const li = document.createElement('li');
      li.textContent = entry.id + ' [' + entry.layer + ']';
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
        const marker = document.createElement('span');
        marker.className = 'cell-marker';
        cell.className = 'cell';
        cell.dataset.row = String(row);
        cell.dataset.col = String(col);
        applyCellVisual(cell, marker, state.tileLayer[row][col], state.objectLayer[row][col]);
        cell.appendChild(marker);
        dom.gridContainer.appendChild(cell);
      }
    }

    dom.gridSizeLabel.textContent = String(state.width);
    dom.gridSizeLabel2.textContent = String(state.height);
  }

  function applyCellVisual(cell, markerEl, tileId, objectId) {
    cell.dataset.tileId = tileId;
    cell.style.backgroundColor = getColorForId(tileId);
    markerEl.textContent = objectId !== OBJECT_IDS.none ? '●' : '';
    markerEl.style.color = objectId !== OBJECT_IDS.none ? getColorForId(objectId) : 'transparent';
    markerEl.title = objectId !== OBJECT_IDS.none ? objectId : '';
  }

  function getColorForId(id) {
    return DEFS_BY_ID[id] ? DEFS_BY_ID[id].color : '#9ca3af';
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
      state.textureBuilder.isPainting = false;
      state.textureBuilder.lastPaintedCellKey = '';
    });

    dom.gridContainer.addEventListener('click', function (event) {
      const cell = getCellFromEventTarget(event.target);
      if (!cell) {
        return;
      }
      paintCellFromElement(cell);
    });

    dom.layerTileBtn.addEventListener('click', function () {
      state.activeLayer = 'tile';
      state.activeTool = state.activeTool === 'fill' ? 'fill' : 'paint';
      onActiveLayerChanged();
    });

    dom.layerObjectBtn.addEventListener('click', function () {
      state.activeLayer = 'object';
      if (state.activeTool === 'fill') {
        state.activeTool = 'paint';
      }
      onActiveLayerChanged();
    });

    dom.eraserBtn.addEventListener('click', function () {
      setSelectedForActiveLayer(state.activeLayer === 'tile' ? TILE_IDS.empty : OBJECT_IDS.none);
      state.activeTool = 'paint';
      updateActiveToolButtonState();
    });

    dom.paintToolBtn.addEventListener('click', function () {
      state.activeTool = 'paint';
      updateActiveToolButtonState();
    });

    dom.fillToolBtn.addEventListener('click', function () {
      if (state.activeLayer === 'object') {
        updateStatus('Fill is tile-layer only. Switched to Paint for object markers.', true);
        state.activeTool = 'paint';
      } else {
        state.activeTool = 'fill';
      }
      updateActiveToolButtonState();
    });

    dom.applySizeBtn.addEventListener('click', applySizeFromInputs);

    dom.mapTypeSelect.addEventListener('change', function () {
      state.mapType = dom.mapTypeSelect.value;
      renderPalette();
      renderLegend();
      ensureSelectedVisible();
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
      if (!window.confirm('Clear the entire map? This cannot be undone.')) {
        return;
      }
      state.tileLayer = createLayerGrid(state.width, state.height, TILE_IDS.empty);
      state.objectLayer = createLayerGrid(state.width, state.height, OBJECT_IDS.none);
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

    dom.openViewerFromTabBtn.addEventListener('click', function () {
      dom.openViewerBtn.click();
    });

    dom.tabMapEditorBtn.addEventListener('click', function () {
      setActiveTab('mapEditor');
    });

    dom.tabViewerBtn.addEventListener('click', function () {
      setActiveTab('viewer');
    });

    dom.tabItemEditorBtn.addEventListener('click', function () {
      setActiveTab('itemEditor');
    });

    dom.tabTextureBuilderBtn.addEventListener('click', function () {
      setActiveTab('textureBuilder');
    });

    dom.itemCategorySelect.addEventListener('change', updateItemConditionalFields);
    dom.itemNewBtn.addEventListener('click', onNewItem);
    dom.itemSaveBtn.addEventListener('click', onSaveItem);
    dom.itemDeleteBtn.addEventListener('click', onDeleteItem);
    dom.itemExportBtn.addEventListener('click', exportItemsToFile);

    dom.itemImportInput.addEventListener('change', function (event) {
      if (!event.target.files || !event.target.files[0]) {
        return;
      }
      importItemsFromFile(event.target.files[0]);
      event.target.value = '';
    });

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

    dom.textureSizeSelect.addEventListener('change', function () {
      const nextSize = Number(dom.textureSizeSelect.value);
      if (TEXTURE_SIZES.indexOf(nextSize) === -1) {
        return;
      }
      state.textureBuilder.size = nextSize;
      state.textureBuilder.pixels = createLayerGrid(nextSize, nextSize, null);
      if (!dom.textureFilenameInput.value.trim()) {
        dom.textureFilenameInput.value = 'texture_' + nextSize + 'x' + nextSize;
      }
      renderTextureGrid();
      updateTextureStatus('Texture grid reset to ' + nextSize + ' x ' + nextSize + '.');
    });

    dom.textureColorPicker.addEventListener('input', function () {
      state.textureBuilder.selectedColor = dom.textureColorPicker.value;
      highlightActiveTexturePaletteButton();
      updateTextureStatus('Custom color selected: ' + dom.textureColorPicker.value);
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

    dom.textureExportBtn.addEventListener('click', exportTextureToFile);
    dom.textureExportPngBtn.addEventListener('click', exportTexturePngToFile);
    dom.textureExportEngineEntryBtn.addEventListener('click', exportTextureEngineEntryToFile);
    dom.textureFilenameInput.addEventListener('blur', function () {
      const fallback = 'texture_' + state.textureBuilder.size + 'x' + state.textureBuilder.size;
      const cleaned = sanitizeTextureFilename(dom.textureFilenameInput.value);
      dom.textureFilenameInput.value = cleaned || fallback;
    });
  }

  function initializeTextureBuilder() {
    dom.textureSizeSelect.value = String(state.textureBuilder.size);
    dom.textureColorPicker.value = state.textureBuilder.selectedColor || '#000000';
    dom.textureFilenameInput.value = 'texture_' + state.textureBuilder.size + 'x' + state.textureBuilder.size;
    renderTexturePalette();
    renderTextureGrid();
    updateTextureToolButtonState();
    updateTextureStatus('Texture Builder ready.');
  }

  function renderTexturePalette() {
    dom.texturePalette.innerHTML = '';

    TEXTURE_COLORS.forEach(function (color) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'texture-color-btn';
      button.dataset.color = color === null ? 'null' : color;
      if (color === null) {
        button.classList.add('texture-transparent');
        button.title = 'Transparent';
      } else {
        button.style.backgroundColor = color;
        button.title = color;
      }
      button.addEventListener('click', function () {
        state.textureBuilder.selectedColor = color;
        highlightActiveTexturePaletteButton();
      });
      dom.texturePalette.appendChild(button);
    });
    highlightActiveTexturePaletteButton();
  }

  function highlightActiveTexturePaletteButton() {
    const selected = state.textureBuilder.selectedColor;
    dom.texturePalette.querySelectorAll('.texture-color-btn').forEach(function (btn) {
      const btnColor = btn.dataset.color === 'null' ? null : btn.dataset.color;
      btn.classList.toggle('active', btnColor === selected);
    });
    if (selected !== null && dom.textureColorPicker) {
      dom.textureColorPicker.value = selected;
    }
    dom.textureSelectedColorLabel.textContent = selected === null ? 'Transparent' : selected;
  }

  function renderTextureGrid() {
    const size = state.textureBuilder.size;
    dom.textureGridContainer.innerHTML = '';
    dom.textureGridContainer.style.setProperty('--texture-grid-width', String(size));
    dom.textureGridContainer.style.setProperty('--texture-grid-height', String(size));

    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size; col += 1) {
        const cell = document.createElement('div');
        cell.className = 'texture-cell';
        cell.dataset.row = String(row);
        cell.dataset.col = String(col);
        applyTextureCellVisual(cell, state.textureBuilder.pixels[row][col]);
        dom.textureGridContainer.appendChild(cell);
      }
    }

    dom.textureSizeLabel.textContent = String(size);
    dom.textureSizeLabel2.textContent = String(size);
  }

  function applyTextureCellVisual(cell, color) {
    if (color === null) {
      cell.classList.add('texture-empty');
      cell.style.backgroundColor = '';
      return;
    }
    cell.classList.remove('texture-empty');
    cell.style.backgroundColor = color;
  }

  function getTextureCellFromEventTarget(target) {
    if (!target || !target.closest) {
      return null;
    }
    return target.closest('.texture-cell');
  }

  function paintTextureCellFromElement(cell) {
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    if (!Number.isInteger(row) || !Number.isInteger(col)) {
      return;
    }

    if (state.textureBuilder.activeTool === 'fill') {
      applyTextureFillAt(row, col, state.textureBuilder.selectedColor);
      renderTextureGrid();
      updateTextureStatus('Texture fill applied from (' + col + ', ' + row + ').');
      return;
    }

    const currentKey = row + ',' + col;
    if (state.textureBuilder.lastPaintedCellKey === currentKey && state.textureBuilder.isPainting) {
      return;
    }
    state.textureBuilder.lastPaintedCellKey = currentKey;

    state.textureBuilder.pixels[row][col] = state.textureBuilder.selectedColor;
    applyTextureCellVisual(cell, state.textureBuilder.pixels[row][col]);
  }

  function applyTextureFillAt(startRow, startCol, color) {
    const pixels = state.textureBuilder.pixels;
    const size = state.textureBuilder.size;
    const targetColor = pixels[startRow][startCol];
    if (targetColor === color) {
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

      if (row < 0 || row >= size || col < 0 || col >= size || pixels[row][col] !== targetColor) {
        continue;
      }

      pixels[row][col] = color;
      queue.push([row - 1, col]);
      queue.push([row + 1, col]);
      queue.push([row, col - 1]);
      queue.push([row, col + 1]);
    }
  }

  function updateTextureToolButtonState() {
    dom.texturePaintToolBtn.classList.toggle('active', state.textureBuilder.activeTool === 'paint');
    dom.textureFillToolBtn.classList.toggle('active', state.textureBuilder.activeTool === 'fill');
    dom.textureActiveToolLabel.textContent = state.textureBuilder.activeTool === 'fill' ? 'Fill' : 'Paint';
  }

  function exportTextureToFile() {
    const payload = {
      type: 'texture',
      size: state.textureBuilder.size,
      pixels: cloneLayer(state.textureBuilder.pixels)
    };
    downloadJsonFile(payload, 'texture_' + state.textureBuilder.size + 'x' + state.textureBuilder.size + '.json');
    updateTextureStatus('Texture JSON exported.');
  }

  function sanitizeTextureFilename(inputValue) {
    return String(inputValue || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_\-]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  function getTextureExportBaseFilename() {
    const fallback = 'texture_' + state.textureBuilder.size + 'x' + state.textureBuilder.size;
    const cleaned = sanitizeTextureFilename(dom.textureFilenameInput.value);
    const filename = cleaned || fallback;
    dom.textureFilenameInput.value = filename;
    return filename;
  }

  function downloadBlobFile(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
  }

  function exportTexturePngToFile() {
    const size = state.textureBuilder.size;
    const pixels = state.textureBuilder.pixels;
    const baseFilename = getTextureExportBaseFilename();
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      updateTextureStatus('Texture PNG export failed (canvas unavailable).', true);
      return;
    }

    ctx.clearRect(0, 0, size, size);
    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size; col += 1) {
        const color = pixels[row][col];
        if (color === null) {
          continue;
        }
        ctx.fillStyle = color;
        ctx.fillRect(col, row, 1, 1);
      }
    }

    canvas.toBlob(function (blob) {
      if (!blob) {
        updateTextureStatus('Texture PNG export failed (blob creation failed).', true);
        return;
      }
      downloadBlobFile(blob, baseFilename + '.png');
      updateTextureStatus('Texture PNG exported.');
    }, 'image/png');
  }

  function exportTextureEngineEntryToFile() {
    const baseFilename = getTextureExportBaseFilename();
    const payload = {
      key: baseFilename,
      path: 'assets/textures/starter/' + baseFilename + '.png'
    };
    downloadJsonFile(payload, baseFilename + '_entry.json');
    updateTextureStatus('Engine texture entry exported.');
  }

  function updateTextureStatus(text, isError) {
    dom.textureMessage.textContent = text;
    dom.textureMessage.style.color = isError ? '#b42318' : '#42556f';
  }

  function onActiveLayerChanged() {
    updateActiveLayerButtons();
    if (state.activeLayer === 'object' && state.activeTool === 'fill') {
      state.activeTool = 'paint';
    }
    renderPalette();
    ensureSelectedVisible();
    updateSelectedToolLabel();
    updateActiveToolButtonState();
  }

  function updateActiveLayerButtons() {
    dom.layerTileBtn.classList.toggle('active', state.activeLayer === 'tile');
    dom.layerObjectBtn.classList.toggle('active', state.activeLayer === 'object');
    dom.activeLayerLabel.textContent = state.activeLayer === 'tile' ? 'Tile Layer' : 'Object Layer';
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
    const nextTileLayer = createLayerGrid(nextWidth, nextHeight, TILE_IDS.empty);
    const nextObjectLayer = createLayerGrid(nextWidth, nextHeight, OBJECT_IDS.none);

    const copyHeight = Math.min(oldHeight, nextHeight);
    const copyWidth = Math.min(oldWidth, nextWidth);
    for (let row = 0; row < copyHeight; row += 1) {
      for (let col = 0; col < copyWidth; col += 1) {
        nextTileLayer[row][col] = state.tileLayer[row][col];
        nextObjectLayer[row][col] = state.objectLayer[row][col];
      }
    }

    state.width = nextWidth;
    state.height = nextHeight;
    state.tileLayer = nextTileLayer;
    state.objectLayer = nextObjectLayer;

    renderGrid();
    syncMapInputsFromState();
    const actionText = nextWidth >= oldWidth && nextHeight >= oldHeight ? 'expanded' : 'resized';
    updateStatus('Map ' + actionText + ' to ' + nextWidth + ' x ' + nextHeight + '. Existing area preserved.');
  }

  function getCellFromEventTarget(target) {
    if (!target || !target.closest) {
      return null;
    }
    const cell = target.closest('.cell');
    return cell;
  }

  function paintCellFromElement(cell) {
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    if (!Number.isInteger(row) || !Number.isInteger(col)) {
      return;
    }

    if (state.activeTool === 'fill') {
      applyFillAt(row, col, state.selectedByLayer.tile);
      renderGrid();
      updateStatus('Fill applied from (' + col + ', ' + row + ').');
      return;
    }

    const currentKey = row + ',' + col;
    if (state.lastPaintedCellKey === currentKey && state.isPainting) {
      return;
    }
    state.lastPaintedCellKey = currentKey;

    applySelectedAt(row, col);
    const marker = cell.querySelector('.cell-marker');
    applyCellVisual(cell, marker, state.tileLayer[row][col], state.objectLayer[row][col]);
  }

  function applyFillAt(startRow, startCol, tileId) {
    const targetTileId = state.tileLayer[startRow][startCol];
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

      if (!isInsideMap(col, row) || state.tileLayer[row][col] !== targetTileId) {
        continue;
      }

      state.tileLayer[row][col] = tileId;
      queue.push([row - 1, col]);
      queue.push([row + 1, col]);
      queue.push([row, col - 1]);
      queue.push([row, col + 1]);
    }
  }

  function applySelectedAt(row, col) {
    if (!isInsideMap(col, row)) {
      return;
    }

    if (state.activeLayer === 'tile') {
      state.tileLayer[row][col] = state.selectedByLayer.tile;
      return;
    }

    const objectId = state.selectedByLayer.object;
    const def = DEFS_BY_ID[objectId];
    if (def && def.unique) {
      clearExistingUniqueObject(objectId);
    }
    state.objectLayer[row][col] = objectId;
  }

  function clearExistingUniqueObject(objectId) {
    for (let row = 0; row < state.height; row += 1) {
      for (let col = 0; col < state.width; col += 1) {
        if (state.objectLayer[row][col] === objectId) {
          state.objectLayer[row][col] = OBJECT_IDS.none;
        }
      }
    }
  }

  function isInsideMap(col, row) {
    return row >= 0 && row < state.height && col >= 0 && col < state.width;
  }

  function setSelectedForActiveLayer(entryId) {
    state.selectedByLayer[state.activeLayer] = entryId;
    updateSelectedToolLabel();
    highlightActivePaletteButton();
  }

  function ensureSelectedVisible() {
    const visibleIds = getVisiblePaletteDefinitions().map(function (tile) {
      return tile.id;
    });
    const currentSelected = state.selectedByLayer[state.activeLayer];
    if (visibleIds.indexOf(currentSelected) === -1) {
      state.selectedByLayer[state.activeLayer] = state.activeLayer === 'tile' ? TILE_IDS.empty : OBJECT_IDS.none;
    }
    updateSelectedToolLabel();
    highlightActivePaletteButton();
  }

  function updateSelectedToolLabel() {
    const selectedId = state.selectedByLayer[state.activeLayer];
    const tile = DEFS_BY_ID[selectedId];
    dom.selectedToolLabel.textContent = (tile ? tile.label : 'Unknown') + ' (' + selectedId + ')';
  }

  function highlightActivePaletteButton() {
    const selectedId = state.selectedByLayer[state.activeLayer];
    dom.palette.querySelectorAll('.tile-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.tileId === selectedId);
    });
  }

  function updateActiveToolButtonState() {
    dom.paintToolBtn.classList.toggle('active', state.activeTool === 'paint');
    dom.fillToolBtn.classList.toggle('active', state.activeTool === 'fill');
    dom.fillToolBtn.disabled = state.activeLayer === 'object';
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
      tiles: cloneLayer(state.tileLayer),
      tileLayer: cloneLayer(state.tileLayer),
      objectLayer: cloneLayer(state.objectLayer)
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
    const mappedTiles = mapTilesToEngineIds();
    const spawn = resolveSpawnFromObjects(mappedTiles);
    const groupedObjects = collectEngineObjectsFromLayer();

    return {
      id: state.mapId,
      name: state.mapName,
      width: state.width,
      height: state.height,
      tiles: mappedTiles,
      objects: groupedObjects,
      spawn: spawn
    };
  }

  function mapTilesToEngineIds() {
    return state.tileLayer.map(function (row) {
      return row.map(function (tileId) {
        return mapTileIdToEngine(tileId);
      });
    });
  }

  function mapTileIdToEngine(tileId) {
    if (Object.prototype.hasOwnProperty.call(ENGINE_TILE_IDS, tileId)) {
      return tileId;
    }

    const tileMap = {
      empty: 'floor_grass_a',
      floor_stone: 'floor_stone_a',
      floor_wood: 'floor_wood_a',
      floor_grass: 'floor_grass_a',
      floor_sand: 'floor_sand_a',
      floor_dirt: 'floor_dirt_a',
      floor_cobble: 'floor_stone_b',
      floor_tile: 'floor_stone_b',
      floor_moss: 'floor_grass_b',
      floor_snow: 'floor_ice_a',
      floor_ash: 'floor_dirt_b',
      floor_crystal: 'floor_marble_a',
      floor_darkstone: 'floor_stone_b',
      floor_marble: 'floor_marble_a',
      floor_ruins: 'floor_stone_b',
      floor_planks: 'floor_wood_a',
      wall_stone: 'wall_rock_a',
      wall_wood: 'wall_wood_a',
      wall_brick: 'wall_brick_a',
      wall_metal: 'wall_brick_b',
      wall_ruin: 'wall_rock_b',
      cliff: 'wall_rock_a',
      tree_block: 'wall_rock_b',
      rock_block: 'wall_rock_a',
      fence: 'wall_wood_a',
      gate_closed: 'wall_wood_a',
      gate_open: 'floor_wood_a',
      breakable_wall: 'wall_brick_a',
      secret_wall: 'wall_rock_b',
      cave_wall: 'wall_rock_a',
      castle_wall: 'wall_brick_b',
      lava: 'hazard_lava',
      water: 'hazard_water',
      swamp: 'hazard_swamp',
      poison: 'hazard_poison',
      acid: 'hazard_poison',
      spikes: 'floor_stone_a',
      fire_trap: 'floor_stone_a',
      ice: 'floor_ice_a',
      mud: 'floor_dirt_b',
      quicksand: 'floor_sand_a',
      cursed_ground: 'hazard_poison',
      electric_floor: 'floor_stone_b',
      thorn_patch: 'floor_grass_b',
      healing_pool: 'hazard_water',
      slow_field: 'hazard_swamp',
      bridge: 'special_portal_pad',
      stairs_up: 'floor_stone_b',
      stairs_down: 'floor_stone_b',
      ladder: 'floor_wood_a',
      jump_pad: 'special_portal_pad',
      narrow_path: 'floor_dirt_a',
      doorway: 'floor_stone_a',
      tunnel_entry: 'floor_stone_b',
      tunnel_exit: 'floor_stone_b',
      one_way_gate: 'wall_wood_a'
    };

    return tileMap[tileId] || 'floor_grass_a';
  }

  function collectTileMetadata() {
    const metadata = [];
    for (let row = 0; row < state.height; row += 1) {
      for (let col = 0; col < state.width; col += 1) {
        const tileId = state.tileLayer[row][col];
        const def = DEFS_BY_ID[tileId];
        if (def && def.effect) {
          metadata.push({ x: col, y: row, tileId: tileId, effect: def.effect });
        }
      }
    }
    return metadata;
  }

  function collectObjectsFromLayer() {
    const objects = [];
    for (let row = 0; row < state.height; row += 1) {
      for (let col = 0; col < state.width; col += 1) {
        const objectId = state.objectLayer[row][col];
        if (objectId === OBJECT_IDS.none) {
          continue;
        }
        const def = DEFS_BY_ID[objectId];
        objects.push({
          id: objectId,
          x: col,
          y: row,
          group: def ? def.group : 'Unknown'
        });
      }
    }
    return objects;
  }

  function collectEngineObjectsFromLayer() {
    const grouped = {
      portals: [],
      shops: [],
      fountains: [],
      enemySpawns: []
    };

    for (let row = 0; row < state.height; row += 1) {
      for (let col = 0; col < state.width; col += 1) {
        const objectId = state.objectLayer[row][col];
        if (objectId === OBJECT_IDS.none || objectId === OBJECT_IDS.player_start) {
          continue;
        }

        if (isPortalObject(objectId)) {
          grouped.portals.push({
            x: col,
            y: row,
            levels: []
          });
          continue;
        }

        if (isShopObject(objectId)) {
          grouped.shops.push({
            x: col,
            y: row,
            shopId: mapShopObjectToEngineShopId(objectId)
          });
          continue;
        }

        if (objectId === OBJECT_IDS.fountain) {
          grouped.fountains.push({ x: col, y: row });
          continue;
        }

        if (isEnemySpawnObject(objectId)) {
          grouped.enemySpawns.push({
            x: col,
            y: row,
            enemyId: mapEnemyObjectToEngineEnemyId(objectId)
          });
        }
      }
    }

    return grouped;
  }

  function resolveSpawnFromObjects(mappedTiles) {
    for (let row = 0; row < state.height; row += 1) {
      for (let col = 0; col < state.width; col += 1) {
        if (state.objectLayer[row][col] === OBJECT_IDS.player_start) {
          return { x: col, y: row };
        }
      }
    }

    return findFallbackSpawn(mappedTiles);
  }

  function findFallbackSpawn(mappedTiles) {
    for (let row = 0; row < state.height; row += 1) {
      for (let col = 0; col < state.width; col += 1) {
        const tileId = mappedTiles[row][col];
        if (tileId.indexOf('wall_') !== 0) {
          return { x: col, y: row };
        }
      }
    }
    return { x: 0, y: 0 };
  }

  function isPortalObject(objectId) {
    return objectId === OBJECT_IDS.portal_level ||
      objectId === OBJECT_IDS.portal_town ||
      objectId === OBJECT_IDS.portal_world ||
      objectId === OBJECT_IDS.return_portal ||
      objectId === OBJECT_IDS.boss_exit ||
      objectId === OBJECT_IDS.locked_portal ||
      objectId === OBJECT_IDS.town_portal ||
      objectId === OBJECT_IDS.exit_marker;
  }

  function isShopObject(objectId) {
    return objectId === OBJECT_IDS.blacksmith ||
      objectId === OBJECT_IDS.armor_shop ||
      objectId === OBJECT_IDS.potion_shop ||
      objectId === OBJECT_IDS.general_shop ||
      objectId === OBJECT_IDS.special_shop;
  }

  function mapShopObjectToEngineShopId(objectId) {
    if (objectId === OBJECT_IDS.blacksmith) return 'shop_blacksmith_t1';
    if (objectId === OBJECT_IDS.special_shop) return 'shop_rare_t2';
    if (objectId === OBJECT_IDS.potion_shop) return 'shop_potion_t1';
    if (objectId === OBJECT_IDS.armor_shop) return 'shop_blacksmith_t1';
    if (objectId === OBJECT_IDS.general_shop) return 'shop_potion_t1';
    return 'shop_potion_t1';
  }

  function isEnemySpawnObject(objectId) {
    return objectId === OBJECT_IDS.enemy_spawn_basic ||
      objectId === OBJECT_IDS.enemy_spawn_ranged ||
      objectId === OBJECT_IDS.enemy_spawn_tank ||
      objectId === OBJECT_IDS.enemy_spawn_swarm ||
      objectId === OBJECT_IDS.enemy_spawn_runner ||
      objectId === OBJECT_IDS.enemy_spawn_elite ||
      objectId === OBJECT_IDS.enemy_spawn_boss ||
      objectId === OBJECT_IDS.ambush_spawn;
  }

  function mapEnemyObjectToEngineEnemyId(objectId) {
    if (objectId === OBJECT_IDS.enemy_spawn_tank || objectId === OBJECT_IDS.enemy_spawn_boss) {
      return 'guardian_golem';
    }
    if (objectId === OBJECT_IDS.enemy_spawn_ranged || objectId === OBJECT_IDS.enemy_spawn_runner || objectId === OBJECT_IDS.enemy_spawn_elite) {
      return 'wolf_runner';
    }
    return 'slime_green';
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
    if (data.map && typeof data.map === 'object') {
      return normalizeMapLikeObject(data.map);
    }
    return normalizeMapLikeObject(data);
  }

  function normalizeMapLikeObject(mapData) {
    const width = Number.isInteger(mapData.width) ? mapData.width : Number.isInteger(mapData.gridSize) ? mapData.gridSize : null;
    const height = Number.isInteger(mapData.height) ? mapData.height : Number.isInteger(mapData.gridSize) ? mapData.gridSize : null;

    if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) {
      throw new Error('Map width and height must be positive integers.');
    }

    const tileSource = Array.isArray(mapData.tileLayer) ? mapData.tileLayer : mapData.tiles;
    if (!Array.isArray(tileSource) || tileSource.length !== height) {
      throw new Error('tileLayer/tiles array must match map height.');
    }

    const normalizedTileLayer = tileSource.map(function (row) {
      if (!Array.isArray(row) || row.length !== width) {
        throw new Error('Each tile row must match map width.');
      }
      return row.map(function (value) {
        return normalizeIdValue(value, 'tile');
      });
    });

    let normalizedObjectLayer = createLayerGrid(width, height, OBJECT_IDS.none);

    if (Array.isArray(mapData.objectLayer) && mapData.objectLayer.length === height) {
      normalizedObjectLayer = mapData.objectLayer.map(function (row) {
        if (!Array.isArray(row) || row.length !== width) {
          throw new Error('Each objectLayer row must match map width.');
        }
        return row.map(function (value) {
          return normalizeIdValue(value, 'object');
        });
      });
    } else if (Array.isArray(mapData.objects)) {
      mapData.objects.forEach(function (entry) {
        if (!entry || !Number.isInteger(entry.x) || !Number.isInteger(entry.y)) {
          return;
        }
        if (entry.y >= 0 && entry.y < height && entry.x >= 0 && entry.x < width) {
          normalizedObjectLayer[entry.y][entry.x] = normalizeIdValue(entry.id, 'object');
        }
      });
    } else {
      for (let row = 0; row < height; row += 1) {
        for (let col = 0; col < width; col += 1) {
          const sourceCell = tileSource[row][col];
          const normalized = normalizeLegacyCombinedValue(sourceCell);
          normalizedTileLayer[row][col] = normalized.tile;
          normalizedObjectLayer[row][col] = normalized.object;
        }
      }

      if (mapData.placements && typeof mapData.placements === 'object') {
        applyLegacyPlacements(mapData.placements, normalizedObjectLayer, width, height);
      }
    }

    const inferredType = typeof mapData.mapType === 'string' ? mapData.mapType : mapData.type;
    return {
      width: width,
      height: height,
      mapType: inferredType === 'town' ? 'town' : 'level',
      mapId: normalizeMapId(mapData.id || mapData.mapId || 'imported_map'),
      mapName: String(mapData.name || mapData.mapName || 'Imported Map'),
      tileLayer: normalizedTileLayer,
      objectLayer: normalizedObjectLayer
    };
  }

  function applyLegacyPlacements(placements, objectLayer, width, height) {
    if (placements.playerStart && Number.isInteger(placements.playerStart.x) && Number.isInteger(placements.playerStart.y)) {
      placeObjectIfInside(objectLayer, placements.playerStart.x, placements.playerStart.y, OBJECT_IDS.player_start, width, height);
    }
    (placements.portals || []).forEach(function (entry) {
      placeObjectIfInside(objectLayer, entry.x, entry.y, OBJECT_IDS.portal_level, width, height);
    });
    (placements.enemySpawns || []).forEach(function (entry) {
      placeObjectIfInside(objectLayer, entry.x, entry.y, OBJECT_IDS.enemy_spawn_basic, width, height);
    });
    (placements.shops || []).forEach(function (entry) {
      placeObjectIfInside(objectLayer, entry.x, entry.y, normalizeIdValue(entry.shopType ? entry.shopType + '_shop' : 'general_shop', 'object'), width, height);
    });
    (placements.fountains || []).forEach(function (entry) {
      placeObjectIfInside(objectLayer, entry.x, entry.y, OBJECT_IDS.fountain, width, height);
    });
    (placements.specials || []).forEach(function (entry) {
      const specialMap = {
        chest: OBJECT_IDS.chest_common,
        trigger: OBJECT_IDS.trigger_marker,
        boss: OBJECT_IDS.enemy_spawn_boss
      };
      placeObjectIfInside(objectLayer, entry.x, entry.y, specialMap[entry.specialType] || OBJECT_IDS.trigger_marker, width, height);
    });
    (placements.interactions || []).forEach(function (entry) {
      placeObjectIfInside(objectLayer, entry.x, entry.y, OBJECT_IDS.npc_spot, width, height);
    });
  }

  function placeObjectIfInside(layer, x, y, objectId, width, height) {
    if (!Number.isInteger(x) || !Number.isInteger(y)) {
      return;
    }
    if (x >= 0 && x < width && y >= 0 && y < height) {
      layer[y][x] = objectId;
    }
  }

  function normalizeLegacyCombinedValue(value) {
    const typeId = normalizeIdValue(value, 'any');
    const def = DEFS_BY_ID[typeId];
    if (!def) {
      return { tile: TILE_IDS.empty, object: OBJECT_IDS.none };
    }
    if (def.layer === 'object') {
      return { tile: TILE_IDS.empty, object: typeId };
    }
    return { tile: typeId, object: OBJECT_IDS.none };
  }

  function normalizeIdValue(value, expectedLayer) {
    let candidate = value;

    if (Number.isInteger(candidate)) {
      candidate = LEGACY_ID_TO_TYPE[candidate] || null;
    }

    if (typeof candidate !== 'string') {
      return expectedLayer === 'object' ? OBJECT_IDS.none : TILE_IDS.empty;
    }

    if (expectedLayer !== 'object' && Object.prototype.hasOwnProperty.call(ENGINE_TILE_IDS, candidate)) {
      return candidate;
    }

    if (!DEFS_BY_ID[candidate]) {
      return expectedLayer === 'object' ? OBJECT_IDS.none : TILE_IDS.empty;
    }

    if (expectedLayer !== 'any' && DEFS_BY_ID[candidate].layer !== expectedLayer) {
      return expectedLayer === 'object' ? OBJECT_IDS.none : TILE_IDS.empty;
    }

    return candidate;
  }

  function applyImportedMap(normalized) {
    state.width = normalized.width;
    state.height = normalized.height;
    state.mapType = normalized.mapType;
    state.mapId = normalized.mapId;
    state.mapName = normalized.mapName;
    state.tileLayer = normalized.tileLayer;
    state.objectLayer = normalized.objectLayer;

    syncMapInputsFromState();
    updateMapLabels();
    renderPalette();
    renderLegend();
    ensureSelectedVisible();
    renderGrid();
  }

  function setActiveTab(tabName) {
    state.activeTab = tabName;
    dom.mapEditorTab.classList.toggle('active', tabName === 'mapEditor');
    dom.viewerTab.classList.toggle('active', tabName === 'viewer');
    dom.itemEditorTab.classList.toggle('active', tabName === 'itemEditor');
    dom.textureBuilderTab.classList.toggle('active', tabName === 'textureBuilder');
    dom.tabMapEditorBtn.classList.toggle('active', tabName === 'mapEditor');
    dom.tabViewerBtn.classList.toggle('active', tabName === 'viewer');
    dom.tabItemEditorBtn.classList.toggle('active', tabName === 'itemEditor');
    dom.tabTextureBuilderBtn.classList.toggle('active', tabName === 'textureBuilder');
  }

  function getDefaultItem() {
    return {
      id: '',
      name: '',
      category: 'weapon',
      baseValue: 0,
      stackable: false,
      rarity: 'common',
      equipSlot: 'weapon',
      mods: {},
      power: 0,
      attackRange: 1,
      cooldown: 1
    };
  }

  function resetItemFormToDefaults() {
    const base = getDefaultItem();
    populateItemForm(base);
    state.selectedItemIndex = -1;
    renderItemList();
    setItemEditorStatus('Creating new item draft.');
  }

  function populateItemForm(item) {
    dom.itemIdInput.value = item.id || '';
    dom.itemNameInput.value = item.name || '';
    dom.itemCategorySelect.value = sanitizeItemCategory(item.category);
    dom.itemBaseValueInput.value = item.baseValue !== undefined ? String(item.baseValue) : '0';
    dom.itemStackableInput.value = String(Boolean(item.stackable));
    dom.itemRaritySelect.value = sanitizeItemRarity(item.rarity);
    dom.itemEquipSlotInput.value = item.equipSlot || '';
    dom.itemModsInput.value = JSON.stringify(isPlainObject(item.mods) ? item.mods : {}, null, 2);
    dom.itemPowerInput.value = item.power !== undefined ? String(item.power) : '';
    dom.itemAttackRangeInput.value = item.attackRange !== undefined ? String(item.attackRange) : '';
    dom.itemCooldownInput.value = item.cooldown !== undefined ? String(item.cooldown) : '';
    dom.itemEffectTypeInput.value = item.effectType || '';
    dom.itemEffectValueInput.value = item.effectValue !== undefined ? String(item.effectValue) : '';
    dom.itemEffectDurationInput.value = item.effectDuration !== undefined ? String(item.effectDuration) : '';
    updateItemConditionalFields();
  }

  function sanitizeItemCategory(category) {
    const allowed = ['weapon', 'armor', 'accessory', 'consumable', 'material', 'key_item'];
    return allowed.indexOf(category) !== -1 ? category : 'material';
  }

  function sanitizeItemRarity(rarity) {
    const allowed = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
    return allowed.indexOf(rarity) !== -1 ? rarity : 'common';
  }

  function updateItemConditionalFields() {
    const category = sanitizeItemCategory(dom.itemCategorySelect.value);
    const showEquip = category === 'weapon' || category === 'armor' || category === 'accessory';
    const showWeapon = category === 'weapon';
    const showConsumable = category === 'consumable';

    dom.equipSlotRow.classList.toggle('hidden', !showEquip);
    dom.modsRow.classList.toggle('hidden', !(showEquip || category === 'weapon'));
    dom.weaponFields.classList.toggle('hidden', !showWeapon);
    dom.consumableFields.classList.toggle('hidden', !showConsumable);
  }

  function renderItemList() {
    dom.itemList.innerHTML = '';
    if (!state.itemDb.items.length) {
      const empty = document.createElement('p');
      empty.textContent = 'No items yet.';
      dom.itemList.appendChild(empty);
      return;
    }

    state.itemDb.items.forEach(function (item, index) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'item-list-entry';
      btn.classList.toggle('active', state.selectedItemIndex === index);
      const name = item.name || '(unnamed)';
      btn.innerHTML = '<strong>' + escapeHtml(item.id || '(no id)') + '</strong><small>' +
        escapeHtml(name) + ' • ' + escapeHtml(item.category || 'material') + ' • ' + escapeHtml(item.rarity || 'common') + '</small>';
      btn.addEventListener('click', function () {
        state.selectedItemIndex = index;
        populateItemForm(item);
        renderItemList();
        setItemEditorStatus('Loaded item ' + (item.id || '(no id)') + '.');
      });
      dom.itemList.appendChild(btn);
    });
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function onNewItem() {
    resetItemFormToDefaults();
  }

  function onSaveItem() {
    let parsedMods = {};
    try {
      parsedMods = parseModsInput(dom.itemModsInput.value);
    } catch (error) {
      setItemEditorStatus('Mods must be valid JSON object: ' + error.message, true);
      return;
    }

    const formItem = buildItemFromForm(parsedMods);
    const validationError = validateItem(formItem);
    if (validationError) {
      setItemEditorStatus(validationError, true);
      return;
    }

    if (state.selectedItemIndex >= 0) {
      const original = state.itemDb.items[state.selectedItemIndex] || {};
      const merged = mergeItemWithUnknownFields(original, formItem);
      const duplicate = findItemIndexById(formItem.id, state.selectedItemIndex);
      if (duplicate !== -1) {
        setItemEditorStatus('Item ID must be unique.', true);
        return;
      }
      state.itemDb.items[state.selectedItemIndex] = merged;
      setItemEditorStatus('Item updated: ' + formItem.id + '.');
    } else {
      const duplicate = findItemIndexById(formItem.id, -1);
      if (duplicate !== -1) {
        setItemEditorStatus('Item ID must be unique.', true);
        return;
      }
      state.itemDb.items.push(formItem);
      state.selectedItemIndex = state.itemDb.items.length - 1;
      setItemEditorStatus('Item created: ' + formItem.id + '.');
    }

    renderItemList();
  }

  function buildItemFromForm(parsedMods) {
    const category = sanitizeItemCategory(dom.itemCategorySelect.value);
    const output = {
      id: dom.itemIdInput.value.trim(),
      name: dom.itemNameInput.value.trim(),
      category: category,
      baseValue: parseRequiredNumber(dom.itemBaseValueInput.value, 0),
      stackable: dom.itemStackableInput.value === 'true',
      rarity: sanitizeItemRarity(dom.itemRaritySelect.value)
    };

    if (category === 'weapon') {
      output.equipSlot = dom.itemEquipSlotInput.value.trim();
      output.mods = parsedMods;
      output.power = parseOptionalNumber(dom.itemPowerInput.value);
      output.attackRange = parseOptionalNumber(dom.itemAttackRangeInput.value);
      output.cooldown = parseOptionalNumber(dom.itemCooldownInput.value);
    } else if (category === 'armor' || category === 'accessory') {
      output.equipSlot = dom.itemEquipSlotInput.value.trim();
      output.mods = parsedMods;
    } else if (category === 'consumable') {
      output.stackable = dom.itemStackableInput.value === 'true';
      output.effectType = dom.itemEffectTypeInput.value.trim();
      output.effectValue = parseOptionalNumber(dom.itemEffectValueInput.value);
      output.effectDuration = parseOptionalNumber(dom.itemEffectDurationInput.value);
    }

    return removeUndefinedValues(output);
  }

  function parseModsInput(raw) {
    const trimmed = String(raw || '').trim();
    if (!trimmed) {
      return {};
    }
    const parsed = JSON.parse(trimmed);
    if (!isPlainObject(parsed)) {
      throw new Error('mods must be an object.');
    }
    return parsed;
  }

  function parseRequiredNumber(raw, fallback) {
    if (raw === '' || raw === null || raw === undefined) {
      return fallback;
    }
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : NaN;
  }

  function parseOptionalNumber(raw) {
    if (raw === '' || raw === null || raw === undefined) {
      return undefined;
    }
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : NaN;
  }

  function removeUndefinedValues(obj) {
    return Object.keys(obj).reduce(function (acc, key) {
      if (obj[key] !== undefined) {
        acc[key] = obj[key];
      }
      return acc;
    }, {});
  }

  function validateItem(item) {
    if (!item.id) {
      return 'Item ID is required.';
    }

    if (!item.name) {
      return 'Item name is required.';
    }

    const numberKeys = ['baseValue', 'power', 'attackRange', 'cooldown', 'effectValue', 'effectDuration'];
    for (let i = 0; i < numberKeys.length; i += 1) {
      const key = numberKeys[i];
      if (item[key] !== undefined && !Number.isFinite(item[key])) {
        return key + ' must be a valid number.';
      }
    }

    return '';
  }

  function findItemIndexById(itemId, ignoreIndex) {
    return state.itemDb.items.findIndex(function (entry, index) {
      if (index === ignoreIndex) {
        return false;
      }
      return entry && entry.id === itemId;
    });
  }

  function mergeItemWithUnknownFields(original, updated) {
    const preserved = shallowClone(original);
    const merged = {};

    Object.keys(preserved).forEach(function (key) {
      merged[key] = preserved[key];
    });

    Object.keys(updated).forEach(function (key) {
      merged[key] = updated[key];
    });

    return merged;
  }

  function shallowClone(obj) {
    if (!obj || typeof obj !== 'object') {
      return {};
    }
    return Object.keys(obj).reduce(function (acc, key) {
      acc[key] = obj[key];
      return acc;
    }, {});
  }

  function isPlainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  function onDeleteItem() {
    if (state.selectedItemIndex < 0 || state.selectedItemIndex >= state.itemDb.items.length) {
      setItemEditorStatus('Select an item to delete.', true);
      return;
    }
    const target = state.itemDb.items[state.selectedItemIndex];
    if (!window.confirm('Delete item ' + (target.id || '(no id)') + '?')) {
      return;
    }
    state.itemDb.items.splice(state.selectedItemIndex, 1);
    state.selectedItemIndex = -1;
    resetItemFormToDefaults();
    renderItemList();
    setItemEditorStatus('Item deleted.');
  }

  function exportItemsToFile() {
    downloadJsonFile({ items: state.itemDb.items }, 'items_database.json');
    setItemEditorStatus('Item database exported.');
  }

  function importItemsFromFile(file) {
    const reader = new FileReader();

    reader.onload = function () {
      try {
        const parsed = JSON.parse(String(reader.result));
        const normalized = normalizeImportedItems(parsed);
        state.itemDb = { items: normalized };
        state.selectedItemIndex = -1;
        resetItemFormToDefaults();
        renderItemList();
        setItemEditorStatus('Items imported successfully.');
      } catch (error) {
        setItemEditorStatus('Item import failed: ' + error.message, true);
      }
    };

    reader.onerror = function () {
      setItemEditorStatus('Item import failed: unable to read file.', true);
    };

    reader.readAsText(file);
  }

  function normalizeImportedItems(payload) {
    const list = Array.isArray(payload) ? payload : payload && Array.isArray(payload.items) ? payload.items : null;
    if (!list) {
      throw new Error('Expected JSON format: {"items": [...]} or an array of items.');
    }

    const normalized = list.map(function (entry) {
      if (!entry || typeof entry !== 'object') {
        throw new Error('Each item must be an object.');
      }
      const clone = shallowClone(entry);
      clone.id = String(clone.id || '').trim();
      clone.name = String(clone.name || '').trim();
      clone.category = sanitizeItemCategory(clone.category);
      clone.rarity = sanitizeItemRarity(clone.rarity);
      clone.baseValue = parseRequiredNumber(clone.baseValue, 0);
      clone.stackable = Boolean(clone.stackable);
      if (clone.mods !== undefined && !isPlainObject(clone.mods)) {
        clone.mods = {};
      }
      return clone;
    });

    const idSet = new Set();
    normalized.forEach(function (entry) {
      const error = validateItem(entry);
      if (error) {
        throw new Error('Invalid imported item ' + (entry.id || '(missing id)') + ': ' + error);
      }
      if (idSet.has(entry.id)) {
        throw new Error('Duplicate item ID found: ' + entry.id);
      }
      idSet.add(entry.id);
    });

    return normalized;
  }

  function setItemEditorStatus(text, isError) {
    dom.itemEditorMessage.textContent = text;
    dom.itemEditorMessage.style.color = isError ? '#b42318' : '#42556f';
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
