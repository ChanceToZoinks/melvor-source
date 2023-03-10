"use strict";
class SteamAchievement {
  constructor(data, game) {
    this.id = data.id;
    this.requirements = data.requirements.map((data) =>
      game.getRequirementFromData(data)
    );
    if (data.requiredGamemodeID !== undefined) {
      const gamemode = game.gamemodes.getObjectByID(data.requiredGamemodeID);
      if (gamemode === undefined)
        throw new Error(
          `Error constructing SteamAchievement. Gamemode with id: ${data.requiredGamemodeID} is unregistered.`
        );
      this.requiredGamemode = gamemode;
    }
  }
}
