<template>
  <form class="settings">
    <div @click="$store.commit('toggleSetting','translate')">
        Latinska kapitelnamn <div class="toggle" v-bind:class="{'active': $store.state.translate}"></div>
    </div>
    <div @click="$store.commit('toggleSetting','night')">
        Mörk bakgrund <div class="toggle" v-bind:class="{'active': $store.state.night}"></div>
    </div>
    <div @click="$store.commit('toggleSetting','larger')">
        Större sångtext <div class="toggle" v-bind:class="{'active': $store.state.larger}"></div>
    </div>
    <div @click="$store.commit('toggleSetting','generator')">
        Skapa sångblad <div class="toggle" v-bind:class="{'active': $store.state.generator}"></div>
    </div>
    <!--div class="copy" ng-if="stage == stages.lyrics" ng-click="copyToClipboard(chapters[current.chapterindex].songs[current.songindex])">
        Kopiera sångtext
    </div-->
  </form>
</template>

<style scoped lang="scss">
.toggle {
    float: right;
    width: 0.8em;
    height: 0.8em;
    border-radius: 0.4em;
    border: 1px solid #F60;
    margin-top: 0.3em;
    padding: 0;
}

.toggle.active {
  background-color: #F60;
}
</style>
