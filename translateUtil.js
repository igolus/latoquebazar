const axios = require('axios');
const local = require('./localFr.js');
const {localFr} = require("./localFr");
const fs = require("fs");
const source  = require('./frtranslation.json');

const options = (text) => {
    return {
        method: 'GET',
        url: 'https://nlp-translation.p.rapidapi.com/v1/translate',
        params: {
            text: text,
            to: 'en',
            from: 'fr'
        },
        headers: {
            'X-RapidAPI-Key': '***',
            'X-RapidAPI-Host': 'nlp-translation.p.rapidapi.com'
        }
    }
};

async function callTranstale(text) {
    const res =  await axios.request(options(text));
    return res.data.translated_text.en;
}


async function translateAll() {

    // const translate = await callTranstale("Réinitialiser votre mot de passe {0}");
    // console.log(translate);

    const translate = {};
    const keys = Object.keys(source);

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        console.log("done " + i)
        value = localFr.fr[key];
        if (typeof value === 'string') {
            translate[key] = await callTranstale(value);
        }
        // else {
        //     translate[key] = {};
        //     const keysInside = Object.keys(value);
        //     for (let j = 0; j < keysInside.length; j++) {
        //         const keysInsideElement = keysInside[j];
        //         valueInside = localFr.fr[key][keysInsideElement];
        //         translate[key][keysInsideElement] = await callTranstale(valueInside);
        //     }
        // }
    }



    fs.writeFile("localEn2.json", JSON.stringify(translate, null, 2), (error) => {
        // throwing the error
        // in case of a writing problem
        if (error) {
            // logging the error
            console.error(error);

            throw error;
        }

        console.log("localEn.json written correctly");
    });
}

translateAll();
