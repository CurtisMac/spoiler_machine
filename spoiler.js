const cheerio = require('cheerio')
const request = require('request')
const readlineSync = require('readline-sync')
let movie = readlineSync.question(`Enter the name of a movie you would like me to spoil: `)
while (!movie){
    movie = readlineSync.question(`Please enter the name of a movie: `)
}
const countDwn = readlineSync.question(`How many seconds do you want to wait? `, {
    limit: /[1-9][0-9]*/,
    limitMessage: `Please enter a number greater than zero!`
})

console.log(`**Spoiler Alert! The movie '${movie}' will be spoiled in ${countDwn} secs!`)
setTimeout(() => { getSpoiler() }, countDwn * 1000)

request(urlBuilder(`https://www.google.ca/search?q=`), function (err, response, body) {
    if (!err) {
        let $ = cheerio.load(body)
        console.log(`While you wait, here are Google's top results for '${movie}':`)
        let results = $('h3, .r').each(function (i, elements) {
            console.log(`    ${$(this).text()}`)
        })
    } else {
        console.log(`*Sorry, we've encountered an error*`)
    }
})

function getSpoiler() {
    request(urlBuilder(`https://api.themoviedb.org/3/search/movie?api_key=1eb7ae5fe70ccaa91530537bdf3dc0ea&query=`), (err, response, body) => {
        if (!err) {
            let obj = JSON.parse(body)
            if (obj.total_results == 0) {
                console.log(`Sorry, we couldn't find a spoiler for '${movie}'`)
            } else {
                console.log(`Here is the spoiler for the movie '${movie}':\n${obj.results[0].overview}`)
            }
        }
        else {
            console.log(`Sorry, we encountered an error`)
        }
    })
}

function urlBuilder(url) {
    let fullUrl = url
    let movieSplit = movie.split(' ')
    for (var i = 0; i < movieSplit.length; i++) {
        fullUrl += movieSplit[i] + '+'
    }
    return fullUrl
}

// This product uses the TMDb API but is not endorsed or certified by TMDb

