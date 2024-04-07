Unit tests, lint, test coverage: 
[![Week1](https://github.com/SpaceCadet5100/avans-devops-2324-jedrzej/actions/workflows/week1.js.yml/badge.svg?branch=main)](https://github.com/SpaceCadet5100/avans-devops-2324-jedrzej/actions/workflows/week1.js.yml)
[![photos](https://github.com/SpaceCadet5100/avans-devops-2324-jedrzej/actions/workflows/photos.js.yml/badge.svg?branch=main)](https://github.com/SpaceCadet5100/avans-devops-2324-jedrzej/actions/workflows/photos.js.yml) 


### Photos Service

### GET '/photos'

Deze route haalt alle foto's op uit de database en retourneert deze als een JSON-array.

### POST '/photos'

Deze route maakt een nieuwe foto aan in de database. Het vereist een JSON-payload met de volgende velden: 'image' (de afbeelding zelf) en 'userId' (de gebruikers-ID van de eigenaar van de foto). Als een van deze velden ontbreekt, retourneert de route een 400-fout. Nadat de foto is toegevoegd aan de database, wordt er ook een bericht verzonden naar een message queue met de gebruikers-ID van de eigenaar van de foto.


### Users Service

#### GET '/users'

Deze route haalt alle gebruikers op uit de database en retourneert ze als een JSON-array.

#### POST '/users'

Deze route voegt een nieuwe gebruiker toe aan de database. Het verwacht een JSON-payload met de gegevens van de nieuwe gebruiker en voegt deze toe aan de 'users'-collectie in de database.

### Users With Photos Service

#### GET '/users-with-photos'

Deze route haalt alle gebruikers op die foto's hebben uit de database en retourneert ze als een JSON-array. Dit lijkt een verzameling te zijn van gebruikers die een foto hebben toegevoegd, mogelijk om het snel op te halen voor weergavedoeleinden.

