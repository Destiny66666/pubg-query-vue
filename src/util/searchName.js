const getSearchName = () => {
    try {

        return JSON.parse(localStorage.getItem('searchName'))
    } catch (error) {
        return []
    }

}

const setSearchName = (searchName) => {
    let searchNameList = []
    try {
        searchNameList = JSON.parse(localStorage.getItem('searchName')) || []
    } catch (error) {
        searchNameList = []
        localStorage.removeItem('searchName')
    }

    for (let i = 0; i <= searchNameList.length; i++) {
        if (searchNameList[i] === searchName) {
            return
        }
    }
    searchNameList.unshift(searchName)
    localStorage.setItem('searchName', JSON.stringify(searchNameList))
}

const deleteSearchNameByIndex = (index)=>{
    let searchNameList
    try {
        searchNameList = JSON.parse(localStorage.getItem('searchName')) || []
    } catch (error) {
        searchNameList = []
        localStorage.removeItem('searchName')
    }
    let newSearchNameList = searchNameList.filter((_, i) => i !== index);
    localStorage.setItem('searchName', JSON.stringify(newSearchNameList))
}

export {
    getSearchName,
    setSearchName,
    deleteSearchNameByIndex,
}
