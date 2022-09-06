import { listingsDb } from './db';
import { readFile } from 'fs/promises';

jest.mock('fs/promises');

const mockedReadFile = jest.mocked(readFile);

const TEST_DATA = `
id,listing_url,name,description,picture_url,host_id,host_response_time,neighbourhood,neighbourhood_cleansed,neighbourhood_group_cleansed,latitude,longitude,room_type,accommodates,bedrooms,beds,amenities,price,number_of_reviews,review_scores_rating,review_scores_accuracy,review_scores_cleanliness,review_scores_checkin,review_scores_communication,review_scores_location,review_scores_value,reviews_per_month
20480198,https://www.airbnb.com/rooms/20480198,Casa de São João,"Uma pérola envolta da magia da região de Lafões.<br />Presenteia-nos com o grande lago da barragem de Ribeiradio,Rio Teixeira, Serra da Freita, Passadiços do Paiva,termas de S.Pedro do Sul, as vilas de Oliveira de Frades e Vouzela .Viseu a 29 Km, Aveiro a 38 Km e Porto a 125 Km.<br />1º andar com seis quartos amplos, tendo um deles WC privativo, e um partilhado. R/C Sala de jantar, estar, cozinha que permite confeccionar as refeições, 1 WC e jardim exterior.<br />Recebemos com conforto, confiança e segurança.<br /><br /><b>Guest access</b><br />A toda à casa",https://a0.muscache.com/pictures/e500c794-30b2-4d6b-8964-5ed397237be0.jpg,146202861,within an hour,,Arões,VALE DE CAMBRA,40.78164,-8.2434,Entire home/apt,10,6,8,"[""Wifi"", ""Fireplace guards"", ""Dedicated workspace"", ""Extra pillows and blankets"", ""Dishwasher"", ""Hair dryer"", ""Essentials"", ""Bed linens"", ""Room-darkening shades"", ""Hangers"", ""Private entrance"", ""High chair"", ""Free parking on premises"", ""BBQ grill"", ""TV"", ""Dishes and silverware"", ""Pocket wifi"", ""Refrigerator"", ""Kitchen"", ""Crib"", ""Patio or balcony"", ""Cleaning before checkout"", ""Iron"", ""Backyard"", ""Bathtub"", ""Outlet covers"", ""Indoor fireplace"", ""Microwave"", ""First aid kit"", ""Luggage dropoff allowed"", ""Shampoo"", ""Coffee maker"", ""Hot water"", ""Oven"", ""Fire extinguisher"", ""Stove"", ""Cooking basics"", ""Long term stays allowed""]",$150.00,4,5.0,5.0,5.0,5.0,5.0,5.0,4.5,0.07
52337524,https://www.airbnb.com/rooms/52337524,Detached Guest House in Luxury Villa with Pool,"Luxury Villa between Porto and Braga at 20 min from the beach and 25 minutes from Porto, Braga & Guimarães. Take it easy at this unique and tranquil getaway.<br /><br /><b>The space</b><br />Stand-alone / detached guest house. It will feel like a country side studio apartment. With full kitchen and bathroom.<br /><br /><b>Guest access</b><br />Guests will have access to the entire backyard, Pool, barbecue area and gardens also can park the car inside the property or in the garage.<br /><br /><b>Other things to note</b><br />I’m a Portuguese native but a mixed race. I love cultures…  I speak fluent 3 languages (Portuguese, English & Spanish ), and I understand Italian & French. I lived 19 years abroad in 6 different countries, I love people!!!<br /><br /><b>License number</b><br />13286/AL",https://a0.muscache.com/pictures/5b34cbd2-0ca8-4a53-b8f6-ad3695610592.jpg,423414022,within an hour,"Ribeirão, Braga, Portugal",Bougado (São Martinho e Santiago),TROFA,41.34749,-8.56984,Entire home/apt,2,1,1,"[""Bluetooth sound system"", ""Fireplace guards"", ""Extra pillows and blankets"", ""Dishwasher"", ""Hair dryer"", ""Essentials"", ""Bed linens"", ""Room-darkening shades"", ""Hangers"", ""Private entrance"", ""Baking sheet"", ""Outdoor dining area"", ""Conditioner"", ""Drying rack for clothing"", ""Toaster"", ""Free parking on premises"", ""BBQ grill"", ""TV"", ""Dishes and silverware"", ""Body soap"", ""Shared outdoor pool"", ""Refrigerator"", ""Free street parking"", ""Kitchen"", ""Wifi \u2013 25 Mbps"", ""Outdoor shower"", ""Dining table"", ""Trash compactor"", ""Iron"", ""Freezer"", ""Shower gel"", ""Indoor fireplace"", ""Microwave"", ""First aid kit"", ""Luggage dropoff allowed"", ""Shampoo"", ""Coffee maker"", ""Washer"", ""Hot water"", ""Shared fenced garden or backyard"", ""Portable heater"", ""Shared patio or balcony"", ""Wine glasses"", ""Barbecue utensils"", ""Long term stays allowed"", ""Safe"", ""Single level home"", ""Dryer"", ""Ethernet connection"", ""Hot water kettle"", ""Oven"", ""Clothing storage: closet"", ""Cooking basics"", ""Cleaning products""]",$100.00,2,4.0,5.0,5.0,5.0,5.0,5.0,3.5,2
`;

beforeEach(() => {
  mockedReadFile.mockReset();
});

describe('getListings', () => {
  it('should parse simple CSV', async () => {
    mockedReadFile.mockResolvedValueOnce(TEST_DATA);

    const listings = await listingsDb.getListings();

    expect(listings).toHaveLength(2);
    expect(listings[0]).toMatchObject({ id: '20480198' });
    expect(listings[1]).toMatchObject({ id: '52337524' });
  });
});
