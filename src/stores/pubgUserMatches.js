import {defineStore} from "pinia";
import {ref} from "vue";

export const pubgUserMatches = defineStore("pubgUserMatches", () => {
    const matches = ref([])

    const setMatches = (data)=>{
        matches.value = data
    }

    const removeMatches = ()=>{
        matches.value = ''
    }

    return {
        removeMatches,
        setMatches,
        matches
    }
},{
    persist: true,
})
