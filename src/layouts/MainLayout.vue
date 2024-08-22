<script setup>
import SearchLocation from 'src/components/SearchLocation.vue';
import TopLocations from 'src/components/TopLocations.vue';
import LocationWeather from 'src/components/LocationWeather.vue';
import { useLocationStore } from 'src/stores/useLocationStore';
import { useConfigStore } from 'src/stores/useConfigStore';
import { useI18n } from 'vue-i18n';
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { Cookies } from 'quasar'

const { t, locale } = useI18n();
const selectedLocale = ref(locale.value); // Variável intermediária
const locationStore = useLocationStore();
const configStore = useConfigStore();
const { temperatureUnit } = storeToRefs(configStore);

defineOptions({
  name: 'MainLayout'
})

const changeLocale = (newLocale) => {
  Cookies.set('locale', newLocale.value);
  selectedLocale.value = newLocale.value;
  locale.value = newLocale.value;
}


watch(temperatureUnit, (val) => {
  Cookies.set('temperatureUnit', val);
})
</script>

<template>
  <div class="fullscreen q-pa-sm">
    <q-layout view="lHh lpr lFf" container class="shadow-2 rounded-borders bg-white">
      <q-header bordered class="bg-orange-5 text-dark q-pa-xs">
        <q-toolbar class="text-dark">
          <q-toolbar-title class="text-center text-wrap">
            <q-avatar>
              <img src="../assets/weather-few-clouds-svgrepo-com.svg">
            </q-avatar>
            {{ $t('titleApp') }}
          </q-toolbar-title>
          <div class="q-pa-xs row items-center q-gutter-md">
            <q-btn-toggle v-model="temperatureUnit" no-caps rounded unelevated toggle-color="black" color="white"
              text-color="black" :options="[
                { label: 'ºC', value: 'celsius' },
                { label: 'ºF', value: 'fahrenheit' }
              ]" />
            <q-select filled selected v-model="selectedLocale" @update:model-value="changeLocale" color="orange"
              :options="[
                { label: 'en-US', value: 'en-US' },
                { label: 'pt-BR', value: 'pt-BR' }
              ]" :hint="t('language')" />
          </div>

        </q-toolbar>
      </q-header>

      <q-page-container>
        <q-page class="column q-pa-sm">
          <SearchLocation style="max-width: 100%;"></SearchLocation>
          <div class="row q-pa-sm justify-evenly items-center" style="width: 100%">
            <div class=" col-xs-12 col-md-6 col-lg-4 items-center self-stretch q-mb-xs"
              v-for=" location in locationStore.locationsSelectedList" :key="location.latLong">
              <LocationWeather :location="location">
              </LocationWeather>
            </div>
          </div>
          <TopLocations></TopLocations>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<style scope>
.text-wrap {
  text-wrap: wrap;
}
</style>
