const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const app = express()
const fs = require('fs')

// Middleware para manejar datos JSON
app.use(express.json());
// Middleware para manejar datos de formularios URL-encoded
app.use(express.urlencoded({ extended: true }));

const url = 'https://elpais.com/ultimas-noticias/'
let noticias = []

app.get('/', (req,res)=>{
    leerDatos()
    res.json(noticias)
})

app.get('/noticias/:id', (req,res) => {
    leerDatos()
    const id = parseInt(req.params.id)
    const findIndex = noticias.findIndex(noticia => noticia.id === id)
    if (findIndex === -1) {
        res.status(404).json({message: "El id no existe"})
    }else{
        const noticiaId = noticias.find(noticia => noticia.id === id)
        res.json(noticiaId)
    }
    
    
})
app.put("/noticias/:id", (req, res) => {
    leerDatos()
    const idNoticia = parseInt(req.params.id)
    const { title, image, link, description } = req.body
    const findIndex = noticias.findIndex(noticia => noticia.id === idNoticia)


    if (findIndex === -1) {

        res.status(404).json({ error: "noticia no encontrada" })

    } else {
        noticias[findIndex] = {
            ...noticias[findIndex],
            title: title || noticias[findIndex].title,
            image: image || noticias[findIndex].image,
            link: link || noticias[findIndex].link,
            description: description || noticias[findIndex].description,

        }
        guardarDatos()
        res.json(noticias)
    }
})

app.delete('/noticias/:id', (req,res) => {
    const id = parseInt(req.params.id)
    leerDatos() 
    
    const findIndex = noticias.findIndex(noticia => noticia.id === id)
    
    if (findIndex === -1) {
        res.status(404).json({message: "El id no existe"})
    }else{
        const arrayFIltered = noticias.filter(noticia => noticia.id !== id)
        noticias  = arrayFIltered
        guardarDatos() 
        res.json(noticias)
    }

})

app.post('/noticias/:id',(req,res)=>{
    
    leerDatos() 
   
        const nuevaNoticia = {
        id: noticias.length +1,
        title: req.body.title,
        image: req.body.image,
        link: req.body.link,
        description: req.body.description
        
    }

    noticias.push(nuevaNoticia)
    guardarDatos() 
    res.json(noticias)
})

app.listen(4000, () => {
    console.log('express esta escuchando en el puerto http://localhost:4000')
})


function leerDatos() {
    try {
      const data = fs.readFileSync('noticias.json', 'utf-8');
      noticias = JSON.parse(data);
    } catch (error) {
      console.error('Error al leer el archivo noticias.json:', error.message);
    }
  }
  
  
function guardarDatos() {
    fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
  }
 

