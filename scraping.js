const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const app = express()
const fs = require('fs')
const PORT = 3001
const url = 'https://elpais.com/ultimas-noticias/'

let noticias = []

app.get("/", async (req, res) => {
    try {
      const response = await axios.get(url)
      const html = response.data
      const $ = cheerio.load(html)

      $('.b-st_a').find('article').each((i,element) => {
        const noticia = {
            id: noticias.length +1 ,
            title: $(element).find('h2').text(),
            image: $(element).find('img').attr("src"),
            description: $(element).find('p').text(),
            link: $(element).find('a').attr('href')
        }
       
        noticias.push(noticia)
      })
      guardarDatos()

    } catch (error) {
        console.error(`el error es el ${error}`)
        res.status(500).send(`Error interno ${error}`)
      }
     })
     
app.listen(PORT, () => {

    console.log(`express esta escuchando en el puerto https://localhost:${PORT}`)

})

  function guardarDatos() {
    fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
  }