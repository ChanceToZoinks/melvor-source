"use strict";
const gameVersion = "v1.1.1";
const previousGameVersion = "v1.1";
const characterSelectAnnouncementVersion = 4;
const setupSkillLock = (game) => {
  if (
    !game.tutorial.complete ||
    game.currentGamemode.startingSkills !== undefined
  )
    return;
  game.skills.forEach((skill) => {
    skill.setUnlock(
      cloudManager.hasFullVersionEntitlement || isDemoSkill(skill)
    );
  });
};
function showUsernameChange() {
  $("#modal-account-change").modal("show");
}
function changeName() {
  let newName = document.getElementById("username-change").value;
  if (newName === "") newName = getLangString("CHARACTER_SELECT", "75");
  game.characterName = newName;
  $("#account-name").text(newName);
  game.stats.General.inc(GeneralStats.UsernameChanges);
}
function accountDeletion(confirmation = false) {
  if (inCharacterSelection) return;
  if (!confirmation && confirmedLoaded) {
    $("#modal-account-deletion").modal("show");
  } else {
    deleteLocalSaveInSlot();
    window.setTimeout(function () {
      location.reload();
    }, 1000);
  }
}
function gameUpdate() {
  if (gameVersion !== game.lastLoadedGameVersion) {
    addModalToQueue({
      title: gameVersion,
      text: getLangString("CHARACTER_SELECT", "74"),
      imageUrl: cdnMedia("assets/media/main/logo_no_text.svg"),
      imageWidth: 128,
      imageHeight: 128,
      imageAlt: "Melvor Idle",
    });
  }
  game.lastLoadedGameVersion = gameVersion;
}
