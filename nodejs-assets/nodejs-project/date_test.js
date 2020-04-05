// require('datejs');

// // const strings = ['32323 EXP: 06/20 ',
// //                 'Best By N30 JUL 20',
// //                 'BEST BY: FEB/13/2021']
// // const regex = /(EXP|Best By).(.*)/i;
// // strings.forEach((string) => {
// //     console.log(regex.exec(string)[2].trim());
// // })

// const date_strings = ['06/20', '27 MAR 2018', '01/05/13', '31/12/2019', '30 May 18',
//                         'AUG 02 17', 'SEP 17', 'DEC 2017', '040917', '13SEP19',
//                         '15APR2016']
// date_strings.forEach((date_string) => {
//     console.log(date_string + ':  ', Date.parse(date_string) + '\n');
// })
async function quickstart () {
const language = require('@google-cloud/language');

const client = new language.LanguageServiceClient();

const text = `hey In 04/20/2020, EXP
`
const document = {
    content: text,
    type: 'PLAIN_TEXT'
}

const [result] = await client.analyzeEntities({document});

const entities = result.entities;
const date = entities.filter((entity) => {
    return entity.type == 'DATE'
}).map((entity) =>  {
    return entity.name
})

    return date;

}

quickstart().then(response => {
    console.log(response[0]);
}).catch(err => console.log(err));
