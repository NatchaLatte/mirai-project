<template>
  <v-app>
    <v-app-bar>
      <v-btn>
        <v-icon
          class="gradient-color"
          icon="mdi-star-four-points-outline"
          start
        />
        Mirai
      </v-btn>
      <template #append>
        <v-hover>
          <template #default="{ isHovering, props }">
            <v-btn
              :prepend-icon="toggleThemeIcon"
              v-bind="props"
              :color="isHovering ? toggleThemeHoverColor : undefined"
              @click.left="toggleTheme"
            >
              เปลี่ยนธีม
            </v-btn>
          </template>
        </v-hover>
      </template>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-autocomplete
          v-model="selectedProvince"
          placeholder="เลือกจังหวัด"
          clearable
          menu-icon=""
          :items="provinces"
          variant="solo-filled"
          class="my-10"
          @update:model-value="onProvinceSelected"
        >
          <template #prepend-inner>
            <v-icon
              :color="toggleMapMarkerColor"
              icon="mdi-map-marker"
              start
            />
          </template>
        </v-autocomplete>
        <v-card
          v-if="selectedProvince && data.integrity"
          class="mx-auto"
          max-width="368"
          :title="data.province"
          :subtitle="`${data.weatherDescription} รู้สึกเหมือน ${data.feelsLike}&deg;C`"
        >
          <v-card-text class="py-0">
            <v-row
              class="align-center"
              no-gutters
            >
              <v-col
                class="text-h4"
                cols="8"
              >
                {{ data.temp }}&deg;C
              </v-col>

              <v-col
                class="text-right"
                cols="4"
              >
                <v-img
                  :src="`https://openweathermap.org/img/wn/${data.icon}@2x.png`"
                />
              </v-col>
            </v-row>
          </v-card-text>

          <v-row class="d-flex py-3 justify-space-between align-center">
            <v-col>
              <v-list-item
                density="compact"
                prepend-icon="mdi-weather-windy"
                :subtitle="`${data.windSpeed} m/s`"
              />
            </v-col>
            <v-col>
              <v-list-item
                density="compact"
                prepend-icon="mdi-cloud-percent"
                :subtitle="`${data.clouds}%`"
              />
              <v-list-item
                density="compact"
                prepend-icon="mdi-water-percent"
                :subtitle="`${data.humidity}%`"
              />
            </v-col>
          </v-row>
        </v-card>
        <v-row
          v-else-if="selectedProvince && !data.integrity"
          class="d-flex flex-column justify-center align-center"
        >
          <v-img
            width="128"
            min-width="16"
            max-width="128"
            height="128"
            min-height="16"
            max-height="128"
            lazy-src="https://placehold.co/128x128"
            src="@/assets/error.png"
          >
            <template #placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-skeleton-loader
                  width="128"
                  min-width="16"
                  max-width="128"
                  height="128"
                  min-height="16"
                  max-height="128"
                  type="card"
                />
              </div>
            </template>
          </v-img>
          <strong class="text-h4 mt-5">เกิดข้อผิดพลาด</strong>
        </v-row>
        <v-row
          v-else
          class="d-flex flex-column justify-center align-center"
        >
          <v-img
            width="128"
            min-width="16"
            max-width="128"
            height="128"
            min-height="16"
            max-height="128"
            lazy-src="https://placehold.co/128x128"
            src="@/assets/location.png"
          >
            <template #placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-skeleton-loader
                  width="128"
                  min-width="16"
                  max-width="128"
                  height="128"
                  min-height="16"
                  max-height="128"
                  type="card"
                />
              </div>
            </template>
          </v-img>
          <strong class="text-h4 mt-5">กรุณาเลือกสถานที่</strong>
        </v-row>
      </v-container>
    </v-main>
    <svg
      class="waves"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 24 150 28"
      preserveAspectRatio="none"
      shape-rendering="auto"
    >
      <defs>
        <path
          id="gentle-wave"
          d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
        />
      </defs>
      <g class="parallax">
        <use
          xlink:href="#gentle-wave"
          x="48"
          y="0"
          :fill="`rgba(${toggleWaveColor},${toggleWaveColor},${toggleWaveColor},0.7)`"
        />
        <use
          xlink:href="#gentle-wave"
          x="48"
          y="3"
          :fill="`rgba(${toggleWaveColor},${toggleWaveColor},${toggleWaveColor},0.5)`"
        />
        <use
          xlink:href="#gentle-wave"
          x="48"
          y="5"
          :fill="`rgba(${toggleWaveColor},${toggleWaveColor},${toggleWaveColor},0.3)`"
        />
        <use
          xlink:href="#gentle-wave"
          x="48"
          y="7"
          :fill="`rgba(${toggleWaveColor},${toggleWaveColor},${toggleWaveColor},1)`"
        />
      </g>
    </svg>
  </v-app>
</template>

<script lang="ts" setup>
import { useTheme } from 'vuetify'
import { ref } from 'vue'
import axios from 'axios'

const theme = useTheme()
const API_URL = import.meta.env.VITE_API_API_URL
const toggleThemeIcon = ref<string>('mdi-weather-sunny')
const toggleMapMarkerColor = ref<string>('red')
const toggleWaveColor = ref<number>(0)
const toggleThemeHoverColor = ref<string>('error')
const selectedProvince = ref<string | null>(null)
const provinces = ref<string[]>([
  "กรุงเทพมหานคร", "กระบี่", "กาญจนบุรี", "กาฬสินธุ์", "กำแพงเพชร", "ร้อยเอ็ด",
  "ขอนแก่น", "จันทบุรี", "ฉะเชิงเทรา", "ชลบุรี", "ชัยนาท", 
  "ชัยภูมิ", "ชุมพร", "เชียงราย", "เชียงใหม่", "ตรัง", 
  "ตราด", "ตาก", "นครนายก", "นครปฐม", "นครพนม", 
  "นครราชสีมา", "นครศรีธรรมราช", "นครสวรรค์", "นนทบุรี", "นราธิวาส", 
  "น่าน", "บึงกาฬ", "บุรีรัมย์", "ปทุมธานี", "ประจวบคีรีขันธ์", 
  "ปัตตานี", "พะเยา", "พระนครศรีอยุธยา", "พิจิตร", "พิษณุโลก", 
  "เพชรบุรี", "เพชรบูรณ์", "แพร่", "พัทลุง", "ภูเก็ต", 
  "มหาสารคาม", "มุกดาหาร", "แม่ฮ่องสอน", "ยโสธร", "ระนอง", 
  "ระยอง", "ราชบุรี", "ลพบุรี", "ลำปาง", "ลำพูน", 
  "เลย", "ศรีสะเกษ", "สกลนคร", "สงขลา", "สมุทรปราการ", 
  "สมุทรสงคราม", "สมุทรสาคร", "สระแก้ว", "สระบุรี", "สิงห์บุรี", 
  "สุพรรณบุรี", "สุราษฎร์ธานี", "สุรินทร์", "สตูล", "หนองคาย", 
  "หนองบัวลำภู", "อ่างทอง", "อำนาจเจริญ", "อุดรธานี", "อุตรดิตถ์", 
  "อุทัยธานี", "อุบลราชธานี"
])
const data = ref({
  province: '',
  weatherDescription: '',
  feelsLike: 0,
  humidity: 0,
  clouds: 0,
  windSpeed: 0,
  temp: 0,
  icon: '',
  integrity: false
})

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  toggleThemeIcon.value = theme.global.current.value.dark ? 'mdi-weather-night' : 'mdi-weather-sunny'
  toggleThemeHoverColor.value = theme.global.current.value.dark ? 'warning' : 'error'
  toggleMapMarkerColor.value = theme.global.current.value.dark ? 'white' : 'red'
  toggleWaveColor.value = theme.global.current.value.dark ? 255 : 0
}

const onProvinceSelected = async () => {
  if(selectedProvince.value){
    try {
      const response = await axios.post(API_URL, {
        selectedProvince: selectedProvince.value
      })
      data.value = response.data.data
    } catch (error) {
      console.error(error)
      data.value.integrity = false
    }
  }
}
</script>

<style scoped>
.gradient-color {
  background: linear-gradient(45deg, #2196F3, #F06292);
  background-clip: text;
  color: transparent;
}

.waves {
  position:relative;
  width: 100%;
  height:15vh;
  margin-bottom:-7px;
  min-height:100px;
  max-height:150px;
}

.parallax > use {
  animation: move-forever 25s cubic-bezier(.55,.5,.45,.5) infinite;
}
.parallax > use:nth-child(1) {
  animation-delay: -2s;
  animation-duration: 7s;
}
.parallax > use:nth-child(2) {
  animation-delay: -3s;
  animation-duration: 10s;
}
.parallax > use:nth-child(3) {
  animation-delay: -4s;
  animation-duration: 13s;
}
.parallax > use:nth-child(4) {
  animation-delay: -5s;
  animation-duration: 20s;
}
@keyframes move-forever {
  0% {
   transform: translate3d(-90px,0,0);
  }
  100% { 
    transform: translate3d(85px,0,0);
  }
}

@media (max-width: 768px) {
  .waves {
    height:40px;
    min-height:40px;
  }
}
</style>
