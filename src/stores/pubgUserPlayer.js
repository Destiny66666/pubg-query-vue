import {defineStore} from "pinia";
import {reactive, ref} from "vue";

export const pubgUserPlayer = defineStore('pubgUserPlayer', () => {

        const pubgUserPlayer = ref({})

        const setPubgUserPlayer = (data) => {
            pubgUserPlayer.value = data
        }

        const removePubgUserPlayer = () => {
            pubgUserPlayer.value = ''
        }

        return {
            removePubgUserPlayer,
            setPubgUserPlayer,
            pubgUserPlayer
        }
    }, {
        persist: true,
    }
)
