"use strict";
function sendDiscordEvent(eventID, data) {
  try {
    if (
      connectedToPlayFab &&
      location.origin !== "https://test.melvoridle.com"
    ) {
      let discordEvent;
      if (eventID === 0 && typeof data !== "string") {
        const totalLevel = game.completion.skillProgress.currentCount.getSum();
        let killed = "Thieving";
        if (data !== undefined) killed = data.name;
        discordEvent = {
          FunctionName: "discordHardcoreDeath",
          FunctionParameter: {
            PlayerName: game.characterName,
            TotalSkillLevel: totalLevel,
            killedBy: killed,
            account: storedCloudSaves[5],
          },
        };
      } else if (eventID === 1) {
        let mode = "Standard";
        if (game.currentGamemode.id === "melvorF:Hardcore") mode = "Hardcore";
        discordEvent = {
          FunctionName: "discordMaxLevel",
          FunctionParameter: {
            PlayerName: game.characterName,
            gamemode: mode,
            account: storedCloudSaves[5],
          },
        };
      } else if (eventID === 2) {
        discordEvent = {
          FunctionName: "discordHCLevel",
          FunctionParameter: {
            PlayerName: game.characterName,
            skill: data,
            account: storedCloudSaves[5],
          },
        };
      } else if (
        eventID === 3 &&
        game.completion.totalProgressBaseGame >= 100
      ) {
        let mode = "Standard";
        if (game.currentGamemode.id === "melvorF:Hardcore") mode = "Hardcore";
        discordEvent = {
          FunctionName: "discordCompletion",
          FunctionParameter: {
            PlayerName: game.characterName,
            gamemode: mode,
            account: storedCloudSaves[5],
          },
        };
      } else {
        console.warn("Invalid discord event ID");
        return;
      }
      PlayFabClientSDK.ExecuteCloudScript(
        discordEvent,
        OnCloudDiscordEvent,
        OnErrorShared
      );
    }
  } catch (e) {
    console.log("Unable to send discord event");
  }
}
function OnCloudDiscordEvent(result) {
  console.log(result.data);
}
function OnErrorShared(error) {
  console.log(error);
}
