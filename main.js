async function getAPIData(url) {
    try {
        const response = await fetch(url)
        const data = await response.json()
        return data;
    }
    catch (error) {
        console.error(error)
    }
}



//Using the async data
let allSenators = []
let simpleSenators = []
let republicans = []
let democrats = []

const theData = getAPIData('senators.json').then(data => {
    allSenators = (data.results[0].members)
    simpleSenators = makeSimpleMap(allSenators)
    republicans = makeFilter(simpleSenators, "R")
    democrats = makeFilter(simpleSenators, "D")
    //This will sort because it's before the populateDOM
    console.log(sortSenatorsByAge(simpleSenators))
    populateDOM(simpleSenators)
    
})


//Mapping Practice - Good for taking an existing array, looping through elements, and creating a new, custom array
function makeSimpleMap(allofthem) {
    let results = allofthem.map(senator => {
        return {
            id: senator.id,
            name: `${senator.first_name} ${senator.last_name}`,
            party: senator.party,
            age: `${calculate_age(new Date (senator.date_of_birth))}`,
            gender: senator.gender,
            total_votes: senator.total_votes,
            twitter_account: senator.twitter_account, 
            votes_w_party: senator.votes_with_party_pct,
            phone: senator.phone,
        }
    })
    return results
}

//Filtering Practice - Don't filter what doesn't exist in the code yet
//Also loops through array but only returns elements that matcha  certain condition
function makeFilter(simpleList, affiliation) {
    return simpleList.filter(senator => senator.party === affiliation)
}

//Reduce Practice - Takes 2 parameters. The function, and the starting place
//Good for getting to the element you do want
function totalVotes(senatorList) {
   const results = senatorList.reduce((acc, senator) => {
       return acc + senator.total_votes

    }, 0)
    return results
}
function oldestSenator(senatorList) {
    return senatorList.reduce((oldest, senator) => {
        return (oldest.age || 0) > senator.age ? oldest : senator
    }, {})
}

function sortSenatorsByAge(senatorList) {
return senatorList.sort(function (a, b) {
    return a.age - b.age
})
}


const container = document.querySelector('.container')

//Populating the DOM - BTW Can't use data pulled from aysnc function right away
function populateDOM(senator_array) {
    senator_array.forEach(senator => {


        //Creating elements based off sample
        let card = document.createElement('div')
        card.setAttribute('class', 'card')
        let cardImage = document.createElement('div')
        cardImage.setAttribute('class', 'card-image')
        let figure = document.createElement('figure')
        figure.setAttribute('class', 'image')
        let figureImage = document.createElement('img')
        figureImage.src = `https://www.congress.gov/img/member/${senator.id.toLowerCase()}_200.jpg`
        figureImage.addEventListener('error', (event) => {
            let badImage = event.target;
            badImage.src="/images/person.png";
        });
       

        figure.appendChild(figureImage)
        cardImage.appendChild(figure)
        card.appendChild(cardImage)
        container.appendChild(card)
        card.appendChild(cardContent(senator))


    })
}

//This is for creating another part of our bulma sample code
function cardContent(senator) {
let cardContent = document.createElement('div')
cardContent.setAttribute('class', 'card-content')
let media = document.createElement('div')
media.setAttribute('class', 'media')
let mediaLeft = document.createElement('div')
mediaLeft.setAttribute('class', 'media-left')
let figure = document.createElement('figure')
figure.setAttribute('class', 'image is-24x24')
let img = document.createElement('img')

if (senator.party === "D") {
    img.src= `/images/twitter.png`

}
if (senator.party === "ID") {
    img.src= `https://bulma.io/images/placeholders/96x96.png`

}
if (senator.party === "R") {
    img.src= `/images/redtwitter.png`

}

img.alt = 'Placeholder Image'
let mediaContent = document.createElement('div')
mediaContent.setAttribute('class', 'media-content')
let titleP = document.createElement('p')
titleP.setAttribute('class', 'title is-5')
titleP.textContent = senator.twitter_account
let subtitleP = document.createElement('p')
/*subtitleP.setAttribute('class', 'subtitle is-6')
subtitleP.textContent = `${senator.state_rank}`*/ //This is because we didn't set it in the simpleSenators mapping array

let contentDiv = document.createElement('div')
contentDiv.setAttribute('class', 'content')
contentDiv.textContent = `About: My name is ${senator.name} and I vote with my party ${senator.votes_w_party}% of the time. Contact me today at ${senator.phone}`
let contentBreak = document.createElement('br')
let ageP = document.createElement('p')
ageP.textContent = senator.age

mediaContent.appendChild(titleP)
mediaContent.appendChild(subtitleP)
figure.appendChild(img)
mediaLeft.appendChild(figure)
media.appendChild(mediaLeft)
media.appendChild(mediaContent)

contentDiv.appendChild(contentBreak)
contentDiv.appendChild(ageP)

cardContent.appendChild(media)
cardContent.appendChild(contentDiv)

return cardContent
}

function calculate_age(dob) { 
    let diff_ms = Date.now() - dob.getTime();
    let age_dt = new Date(diff_ms); 
  
    return Math.abs(age_dt.getUTCFullYear() - 1970);
}

//Async concept - must console.log within something like a button or whatever to buy time for the function to pull the correct files. async does not follow in time, so somethings are printed in weird order