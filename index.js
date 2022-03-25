
//********************************************************************************************************************************************* */
// IMPORTS

const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const cors = require('cors');
//********************************************************************************************************************************************* */
// FUNCTIONS
async function getCurrency(url) {
  buySelector = 'body > div.wrapper.bitexen-homepage > div.kur-page > div.article-content > div.currency-card.relative.bg-blue-gray-9.rounded-md.p-16 > div.flex.justify-between.mt-8 > div.flex.justify-between > div:nth-child(1) > div.text-md.font-semibold.text-white.mt-4 > span:nth-child(1)'
  sellSelector = 'body > div.wrapper.bitexen-homepage > div.kur-page > div.article-content > div.currency-card.relative.bg-blue-gray-9.rounded-md.p-16 > div.flex.justify-between.mt-8 > div.flex.justify-between > div:nth-child(1) > div.text-md.font-semibold.text-white.mt-4 > span:nth-child(3)'
  let myData = []
  for (let index = 0; index < url.length; index++) {
    const element = url[index];
    var nameOfTheCurrencies = element.substring(element.lastIndexOf("/") + 1, element.length);
    console.log()
    data = await axios.get(element)
    const selector = cheerio.load(data.data)
    let selectedBuy = selector(buySelector).text()
    let selectedSell = selector(sellSelector).text()
    let buyPrice = selectedBuy.replace(/[' '\n]+/g, "")
    let sellPrice = selectedSell.replace(/[' '\n]+/g, "")
    myData.push(nameOfTheCurrencies, { buyPrice, sellPrice })
  }
  return myData;
}
//********************************************************************************************************************************************* */
//SERVER


const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/api/currency/', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json(await getCurrency([
    'https://kur.doviz.com/serbest-piyasa/amerikan-dolari',
    'https://kur.doviz.com/serbest-piyasa/euro'
  ]));
})
PORT = process.env.PORT || 3000
app.listen(PORT, 'localhost')
