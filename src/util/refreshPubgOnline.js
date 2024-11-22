import {getPubgOnlineData} from "@/api/pubgApis.js";

const refreshPubgOnline = async () => {
    let refreshPubgOnlineLocalStorage
    try {
        refreshPubgOnlineLocalStorage = JSON.parse(localStorage.getItem("refreshPubgOnline"));
    } catch (error) {
        refreshPubgOnlineLocalStorage = {}
        return Promise.reject(error);
    }
    if (refreshPubgOnlineLocalStorage == null || judgeExpire(refreshPubgOnlineLocalStorage)) {
        const result = await getPubgOnlineData();
        let res = {
            "online": result.data,
            "expire": Date.now()
        }
        localStorage.setItem("refreshPubgOnline", JSON.stringify(res));
    }
}

const judgeExpire = (data) => {
    let date1 = data.expire;
    let date2 = Date.now()
    // 计算两个时间戳之间的毫秒差
    const timeDifference = Math.abs(date1 - date2);
    return timeDifference > 600000; // 输出 true 或 false

}
const getOnlineUserFirst = () => {
    let onlineUser = JSON.parse(localStorage.getItem("refreshPubgOnline"));
    return onlineUser.online[0].count
}

const getOnlineUserCount = () => {
    let onlineUser = JSON.parse(localStorage.getItem("refreshPubgOnline"));
    let count = []
    for (let i = 0; i < onlineUser.online.length; i++) {
        count.push(onlineUser.online[i].count)
    }
    return count
}

const getOnlineUserTime = () => {
    let onlineUser = JSON.parse(localStorage.getItem("refreshPubgOnline"));
    let time = []
    for (let i = 0; i < onlineUser.online.length; i++) {
        time.push(onlineUser.online[i].format_time)
    }
    return time
}

export {refreshPubgOnline, getOnlineUserFirst, getOnlineUserCount, getOnlineUserTime}
