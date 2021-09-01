<!-- TODO: Perhaps make components for these. They are somewhat redundant... -->

<template>
  <form class="settings">
    <div @click="$store.commit('toggleSetting','translate')">
        Latinska kapitelnamn <div class="toggle" v-bind:class="{'active': $store.state.settings.translate}"></div>
    </div>
    <div @click="$store.commit('toggleSetting','night')">
        Mörk bakgrund <div class="toggle" v-bind:class="{'active': $store.state.settings.night}"></div>
    </div>
    <div @click="$store.commit('toggleSetting','larger')">
        Större sångtext <div class="toggle" v-bind:class="{'active': $store.state.settings.larger}"></div>
    </div>
    <div @click="$store.commit('toggleSetting','generator')">
        Skapa sångblad <div class="toggle" v-bind:class="{'active': $store.state.settings.generator}"></div>
    </div>
    <!--div class="copy" ng-if="stage == stages.lyrics" ng-click="copyToClipboard(chapters[current.chapterindex].songs[current.songindex])">
        Kopiera sångtext
    </div-->
  </form>
</template>

<style scoped lang="css">
.toggle {
    float: right;
    width: 0.8em;
    height: 0.8em;
    border-radius: 0.4em;
    border: 1px solid #f60;
    margin-top: 0.3em;
    padding: 0;
}

.toggle.active {
  background-color: #f60;
}
</style>
