<template>
  <form className="settings">
    <div ng-click="toggleSetting('translate')">
        Latinska kapitelnamn <div className="toggle" ng-style="{'background-color': settings.translate ? '#F60' : 'unset'}"></div>
    </div>
    <div ng-click="toggleSetting('night')">
        Mörk bakgrund <div className="toggle" ng-style="{'background-color': settings.night ? '#F60' : 'unset'}"></div>
    </div>
    <div ng-click="toggleSetting('larger')">
        Större sångtext <div className="toggle" ng-style="{'background-color': settings.larger ? '#F60' : 'unset'}"></div>
    </div>
    <div ng-click="toggleSetting('generator')">
        Skapa sångblad <div className="toggle" ng-style="{'background-color': settings.generator ? '#F60' : 'unset'}"></div>
    </div>
    <div className="copy" ng-if="stage == stages.lyrics" ng-click="copyToClipboard(chapters[current.chapterindex].songs[current.songindex])">
        Kopiera sångtext
    </div>
  </form>
</template>
