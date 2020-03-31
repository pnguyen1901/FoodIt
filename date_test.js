require('datejs');

// const strings = ['32323 EXP: 06/20 ',
//                 'Best By N30 JUL 20',
//                 'BEST BY: FEB/13/2021']
// const regex = /(EXP|Best By).(.*)/i;
// strings.forEach((string) => {
//     console.log(regex.exec(string)[2].trim());
// })

const date_strings = ['06/20', '27 MAR 2018', '01/05/13', '31/12/2019', '30 May 18',
                        'AUG 02 17', 'SEP 17', 'DEC 2017', '040917', '13SEP19',
                        '15APR2016']
date_strings.forEach((date_string) => {
    console.log(date_string + ':  ', Date.parse(date_string) + '\n');
})

