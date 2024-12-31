import express, { Express, Request, Response } from "express";
import axios from "axios";
import cors from "cors";
import { CronJob } from 'cron';

interface WeatherData {
    province: string;
    weatherDescription: string;
    feelsLike: number;
    humidity: number;
    clouds: number;
    windSpeed: number;
    temp: number;
    icon: string;
    integrity: boolean;
}

const app: Express = express();
const port = process.env.PORT || 3001;
const OPEN_WEATHER_API_URL = process.env.OPEN_WEATHER_API_URL;
const APP_ID_API_KEY = process.env.APP_ID_API_KEY;

app.use(cors())
app.use(express.json())

let dataList: WeatherData[] = []

CronJob.from({
    cronTime: '0 0 * * *',
    onTick: () => {
        dataList = []
        console.log('Clear cache for a new day.')
    },
    start: true,
    timeZone: 'Asia/Bangkok'
})

app.post('/', async (req: Request, res: Response): Promise<void> => {
    try{
        const { selectedProvince } = req.body as { selectedProvince: string };
        const data: WeatherData = {
            province: '',
            weatherDescription: '',
            feelsLike: 0,
            humidity: 0,
            clouds: 0,
            windSpeed: 0,
            temp: 0,
            icon: '',
            integrity: false
        }
        if(selectedProvince){
            const isProvinceExist: WeatherData[] = dataList.filter(item => item.province === selectedProvince);
            if(isProvinceExist.length > 0){
                const history = isProvinceExist[0]
                data.province = history.province
                data.weatherDescription = history.weatherDescription
                data.feelsLike = history.feelsLike
                data.humidity = history.humidity
                data.clouds = history.clouds
                data.windSpeed = history.windSpeed
                data.temp = history.temp
                data.icon = history.icon
                data.integrity = history.integrity
            }else{
                const response = await axios.get(`${OPEN_WEATHER_API_URL}/data/2.5/weather?q=${selectedProvince}&units=metric&lang=th&appid=${APP_ID_API_KEY}`)
                data.province = response.data.name
                data.weatherDescription = response.data.weather[0].description
                data.feelsLike = response.data.main.feels_like
                data.humidity = response.data.main.humidity
                data.clouds = response.data.clouds.all
                data.windSpeed = response.data.wind.speed
                data.temp = response.data.main.temp
                data.icon = response.data.weather[0].icon
                data.integrity = true
                dataList.push(data)
            }
        }
        res.status(200).json({ data });
        return
    }catch(error){
        res.status(500);
        return
    }
});

const server = app.listen(port, () => {
    try {
        console.log(`[server] Server is running at http://localhost:${port}`);
    } catch (error) {
        console.error("error");
        process.exit(1);
    }
});

const gracefulShutdown = async (signal: string) => {
    console.log(`${signal} signal received: closing HTTP server`);
    server.close(() => {
      console.log("HTTP server closed");
    });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));