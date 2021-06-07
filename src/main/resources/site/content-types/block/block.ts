// WARNING: This file was automatically generated by "no.item.xp.codegen". You may lose your changes if you edit it.
export interface Block {
  /**
   * Date and time
   */
  datetime: string;

  /**
   * Date and time end
   */
  datetimeEnd?: string;

  /**
   * Title for games' in block
   */
  title?: string;

  /**
   * Description for games' in block
   */
  description?: string;

  /**
   * Block type
   */
  blockType: "day" | "block";

  /**
   * Block number
   */
  blockNumber?: "1" | "2" | "3" | "4" | "5";

  /**
   * Preselected system. For game blocks only
   */
  system?: "dnd5" | "vtm20" | "vtm5" | "pathfinder1" | "pathfinder2" | "shadowrun" | "cyberpunkRed" | "cyberpunk2020" | "wfrp" | "w40kwg" | "coc" | "coriolis" | "talesFromTheLoop" | "mutanYearZero" | "bladesInTheDark" | "morkBorg" | "shinobi" | "fate" | "trailOfCthulhu" | "cavalry" | "enoa";
}
