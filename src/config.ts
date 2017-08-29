export const config = {
    database: {
        keys: {
            omitted: [ '__keep' ]
        }
    },
    snippet: {
        minLengthName: 3,
        maxLengthName: 70,
        maxLengthDescription: 1000,
        maxLengthDescriptionShort: 100,
        maxPopularDisplayed: 16,
        maxLastestAddedDisplayed: 16
    },
    elastic: {
        url: 'https://5s886dfw:z7gjc4csm6ylm3zo@pine-2241382.us-east-1.bonsaisearch.net'
    }
}
