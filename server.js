import express from 'express'
import {pgPool} from './pg_connections.js';

const app = express ()

app.listen(3001, ()=>{
    console.log('Server is running');
});


