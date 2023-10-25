import express from 'express'
import router from './routes/app.routes.js'
import cors from 'cors';

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET"
}));

app.use(express.json());
app.use("/", router);

app.listen(3000, () => {
    console.log("Servidor Express escuchando en http://localhost:3000");
});
