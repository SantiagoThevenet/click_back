// dates.js
import axios from "axios";
import Redis from "ioredis";

const redis = new Redis();

const CACHE_KEY = "availableDates";
const CACHE_TTL = 86400;
const DATE_RANGE = 60;

const ROUTE = "ALGECEUT";

async function getAvailableDates() {
    const cachedData = await redis.get(CACHE_KEY);

    if (cachedData) {
        return JSON.parse(cachedData);
    } else {
        const availableDates = await fetchAvailableDates();
        await redis.set(CACHE_KEY, JSON.stringify(availableDates), "EX", CACHE_TTL);
        return availableDates;
    }
}

async function fetchAvailableDates() {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + DATE_RANGE);

    const datePromises = [];

    while (today <= futureDate) {
        const dateString = formatDate(today);
        datePromises.push(axios.get(`https://tadpole.clickferry.app/departures?route=${ROUTE}&time=${dateString}`));
        today.setDate(today.getDate() + 1);
    }

    const responses = await Promise.all(datePromises);

    const availableDates = responses.map((response, index) => {
        const dateString = formatDate(new Date(new Date().getTime() + index * 24 * 60 * 60 * 1000));
        if (response.data.length > 0) {
            return response.data;
        } else {
            return [
                {
                    time: dateString,
                    isDate: false,
                },
            ];
        }
    });

    return availableDates;
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export { getAvailableDates };
