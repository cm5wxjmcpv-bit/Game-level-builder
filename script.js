(function () {
  'use strict';

  const DEFAULT_WIDTH = 30;
  const DEFAULT_HEIGHT = 30;
  const STORAGE_PREVIEW_KEY = 'levelBuilderPreviewMap';
  const MAX_MAP_SIDE = 200;

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
    applySizeBtn: document.getElementById('applySizeBtn')
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
      tile: TILE_IDS.floor_stone,
      object: OBJECT_IDS.player_start
    },
    activeLayer: 'tile',
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
    updateActiveLayerButtons();
    updateActiveToolButtonState();
    syncMapInputsFromState();
    updateMapLabels();
    updateSelectedToolLabel();
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
    return {
      formatVersion: 3,
      map: {
        mapType: state.mapType,
        type: state.mapType,
        id: state.mapId,
        name: state.mapName,
        width: state.width,
        height: state.height,
        tiles: cloneLayer(state.tileLayer),
        tileLayer: cloneLayer(state.tileLayer),
        objectLayer: cloneLayer(state.objectLayer),
        objects: collectObjectsFromLayer(),
        metadata: {
          tileset: 'default',
          textureMappingHint: 'Use tile ID names in engine texture packs.',
          tileMetadata: collectTileMetadata(),
          future: {
            npcSpawns: [],
            scriptedEvents: [],
            triggers: []
          }
        }
      }
    };
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
      // Legacy single-layer format: split object-like ids out.
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
