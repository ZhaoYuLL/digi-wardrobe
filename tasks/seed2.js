import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { createUser } from "../data/users.js";
import { storeImage, getOutfitPiecesByUsername } from "../data/outfitPieces.js";
import { createNewWardrobe, addFitpost } from "../data/wardrobes.js";
import { createFP } from "../data/fitposts.js";

const users = [
    {
        username: "spongebob",
        firstName: "Spongebob",
        lastName: "Squarepants",
        age: "420",
        email: "pineapple@underthesea@gmail.com",
        password: "Squidward1@",
        bio: "Who lives in a pineapple under the sea?"
    },
]

let spongebob = createUser(users[0].username, users[0].firstName, users[0].lastName, users[0].age, users[0].email, users[0].password, users[0].bio);

const headImages = [
    "79974a7c8b9aeced4f99773386f2b113d568c2f6d8efc6382d2119c332e668c0",
    "88191896f6945e8aaff7451f6fffd55e0644305a9876b2465873dda7d4a256b3",
    "83c18c2666007d7fdfaeb2097876f8f035e5e0e9b9e41a69cfa814921696fda8",
    "f7c9f354cc588116c5812400db2e714f0f264d1106e05b0756d0fdf13b0922a8",
    "381585bba207507afc883c06f9386daaca3e7e0348296e63d245ca77b27490f4",
];
const headLinks = [
    "https://www.dickies.com/hats-beanies/corduroy-cap/WHR55CB++AL.html?cm_mmc=google-_-PLA-_-accessories-hats-_-WHR55&cm_mmc=Google-_-20286891758-_-151470110338-_-&gad_source=1&gclid=Cj0KCQjw_-GxBhC1ARIsADGgDjtn6jcWwlTo-3GV0GT7dVMvXLeBd0kUpuHvbqHd7wPAf7D05Hs91RMaArw6EALw_wcB",
    "https://duckcamp.com/products/redfish-hat-coastal-blue?variant=43012239556739&currency=USD&utm_medium=product_sync&utm_source=google&utm_content=sag_organic&utm_campaign=sag_organic&tw_source=google&tw_adid=637009533105&tw_campaign=19026166991&gad_source=1&gclid=Cj0KCQjw_-GxBhC1ARIsADGgDjsdoi4ITaoTHYGOeIdUzGuR05mh5VKXmSBHF1fJBtL1ES82JmgSwrMaAoijEALw_wcB",
    "https://insomniavisuals.com/products/glitch-logo-beanie?variant=46857130770710&currency=USD&utm_medium=product_sync&utm_source=google&utm_content=sag_organic&utm_campaign=sag_organic&utm_campaign=insomnia_acquire_pmax&src=PAIDGOOGLE20699418717&utm_id=20699418717&tw_source=google&tw_adid=&tw_campaign=20699418717&gad_source=1&gclid=Cj0KCQjw_-GxBhC1ARIsADGgDjsLWzIoLsPc3Dnod9kV_bBwwb196wIHY6Ez_T7g8qjWiwhlofDBIKgaArWkEALw_wcB",
    "https://www.stussy.com/collections/headwear/products/1311107-new-era-9twenty-basic-strapback-real-tree-edge",
    "https://www.stussy.com/collections/headwear/products/1321023-stock-bucket-hat-whea",
]
const headCaptions = [
    "Corduroy Cap",
    "Red fishing hat",
    "Glitch logo beanie",
    "Strapback hat",
    "White Bucket Hat",
]

const bodyImages = [
    "9903ab6777c1152911aa57db1d21aceb48c5817354cdceab710e5b31745ee211",
    "900318f0c920ea3a6568466a9443572f0bc2105f8e89f69cfa156246a77cfc76",
    "24db0a3756ee1cb23b254879484992f3b7f51dbc1b66559d0e650c4634f4af03",
    "45d2fa1ee8c08bb6a4db932a87e5efeaf7d01096854efa8c97c895d676f4b389",
    "87e1790c470ff0ee7f64bb26f4f57b152e7b208e33d82c417b61c8799e06fc6f",
]
const bodyLinks = [
    "https://www.sopula.com/products/vintage-mask-gangster-girl-graphic-cotton-t-shirt?variant=b4c8fa53-4240-4c08-b83a-547ec6ccdf7c&SP01-PMax-US-230804-Tee&gad_source=1&gclid=Cj0KCQjw_-GxBhC1ARIsADGgDjvrgTXVVlyXo6CawR_jzmnY4P9em4NpCSEK0F4y-7LqtjUqeOXhPgMaAur-EALw_wcB",
    "https://www2.hm.com/en_us/productpage.1216430005.html?gad_source=1&gclid=Cj0KCQjw_-GxBhC1ARIsADGgDjts4z7kveb7ek9SOZ2dp68_P4vbL6Ek_7C4YsyRwceI1lquR5qOLVkaAmU4EALw_wcB",
    "https://www.ebbets.com/products/new-york-black-yankees-eff-nlb-pinstripe-button-down-jersey?currency=USD&variant=43375186542781&utm_source=google&utm_medium=cpc&utm_campaign=Google%20Shopping&stkn=39837da7d479&tw_source=google&tw_adid=&tw_campaign=20851855663&gad_source=1&gclid=Cj0KCQjw_-GxBhC1ARIsADGgDjvhnbJvOY6MAsHHUgXusQuf293nnPSHKgnqKi4d5kxAzwsoKETDHUkaAnleEALw_wcB",
    "https://www.amazon.com/Obenie-Alphabet-Pattern-Harajuku-Clothing/dp/B0C3Z7ZZFF/ref=asc_df_B0C3Z7ZZFF/?tag=hyprod-20&linkCode=df0&hvadid=693770472623&hvpos=&hvnetw=g&hvrand=10099103996959119236&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9003488&hvtargid=pla-2258755556127&psc=1&mcid=a3589d71bdcc3d6a936de66932da0d4a&gad_source=4&gclid=Cj0KCQjw_-GxBhC1ARIsADGgDjv1btOV47jLoLIC-bRdrUptqlrWHDyH4Y3o3YfJj3ETBgUm15q2Z0waAneEEALw_wcB",
    "https://www.shopcider.com/product/detail?pid=1028465&style_id=130265&sku_id=135535&currency=USD&local=en&country=US&utm_source=google_shopping&utm_campaign=AdTiger_PLA_US_0_mia_0704&link_id=06dcb3b5976144558c7f14d9197b1c45&gad_source=1&gclid=Cj0KCQjw_-GxBhC1ARIsADGgDjtSjVWTaFa5koA7mR-sJq_WoyXSXF-2KkCRTmBr2SnlD2szOYKUNmQaAp1HEALw_wcB",
]
const bodyCaptions = [
    "Vintage Graphic Cotton T Shirt",
    "Plaid short sleeve shirt from H&M",
    "Black NY Yankees button down Jersey",
    "Alphabet Pattern Harajuku Clothing",
    "SATIN TWO TONE CROP CAMI TOP",
]

const legImages = [
    "5610728dbe350f784c47ab82c953f2ef28bc5124c18d235251840cedd173b149",
    "5055e8754a875829b4702f4a2de80099e21773b43832abf91b7f3b8727155817",
    "bf03b450f21c096a134e6476845dc8718a6cef887108fe618cb1ecec1f3801e9",
    "6bf7f0d0a26a36219746a654f5c7f37fe027295941343a006b858e3b75d46f12",
    "c605df2784962dbabec797eb05896a6fa728cdc511c57b5bd62aeee5b90cbe75",
]
const legLinks = [
    "https://www.acnestudios.com/us/en/acne-studios-2023m-fn-delta/B00336-BUF.html?g=man",
    "https://www.acnestudios.com/us/en/cargo-trousers-charcoal-grey/AK0754-Z79.html?g=woman",
    "https://www.bershka.com/us/faded-effect-skater-cargo-pants-c0p150004033.html?colorId=700",
    "https://www.bershka.com/us/super-baggy-denim-bermuda-jorts-c0p156554399.html?colorId=500",
    "https://www.vintagekid.no/shop/p/y2k-denim-skirt",
]
const legCaptions = [
    "Super Baggy Fit Jeans - Blue/Beige",
    "Charcoal Grey Cargo Trousers",
    "Faded Effect Skater Cargo Pants",
    "Super Baggy Denim Bermuda Jorts",
    "Y2K Denim Skirt",
]

const footImages = [
    "7768dac33c9cfae0fdbe8a3f28389f25b1bfb4bbe4ac6b1880f9dc91e55d1fea",
    "b2e9c8d82f40fd6c1d69c3dcca81b9bf24f505dda2521d28c4ed026925f5aa50",
    "a09ce3fbaec4194ffde61f6096399ba09332f3c42a9880503e7a4d7fc9cc810e",
    "8f352859c6e40a8247f525445a3bae510c9fdedd1b0f0c6c4f6cc74ce51e768b",
    "8d153ff7ed0de4de0636466a02c64201e837006cf1f1cbe35719b6507444da62"
]
const footLinks = [
    "https://www.drmartens.com/us/en/8053-leather-platform-casual-shoes-black/p/24690001?gad_source=1&gclid=Cj0KCQjw_-GxBhC1ARIsADGgDjuavVW7AKzHjXCzp2icYyZHKU4TwvdDzvqD6309l3XCRUKo3O_NezAaArExEALw_wcB",
    "https://www.goat.com/sneakers/travis-scott-x-air-jordan-1-retro-high-og-cd4487-100?utm_source=google_ads&utm_medium=cpc&utm_campaign=20272243100&utm_content=&gad_source=1&gclid=Cj0KCQjw_-GxBhC1ARIsADGgDjtQpt_H0TN-6ARHOKS6JuYSmPn9ZjYkzPCL-toSFPkXezf_fHQiq6caAtK_EALw_wcB",
    "https://www.goat.com/sneakers/mexico-66-kill-bill-2023-1183c102-751?utm_source=google_ads&utm_medium=cpc&utm_campaign=20915717960&utm_content=&gad_source=1&gclid=Cj0KCQjw_-GxBhC1ARIsADGgDju4y7svOkO9yDRxTtTUVlf2zHO_syDP-uZDrBK_32cLVGiBV-e4JRMaAkb1EALw_wcB",
    "https://www.goat.com/sneakers/mschf-big-red-boot-mschf010?utm_source=google_ads&utm_medium=cpc&utm_campaign=20915717960&utm_content=&gad_source=1&gclid=Cj0KCQjw_-GxBhC1ARIsADGgDjsKS5S4lP2ZH4uJScTIIULOmGrypxdcWbZaRfvMH1gNWSfoHlj_4HAaApXCEALw_wcB",
    "https://www.amazon.com/Skechers-Infinite-Lights-Fresh-Sneaker-Purple/dp/B0C4RFMJP5/ref=asc_df_B0C4RFMJP5/?tag=hyprod-20&linkCode=df0&hvadid=693366131672&hvpos=&hvnetw=g&hvrand=2841967388123079606&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9003488&hvtargid=pla-2192159859802&psc=1&mcid=d27d69b57eef39c4ba07e3dd53f145e6&gad_source=1&gclid=Cj0KCQjw_-GxBhC1ARIsADGgDjtMguYkhQdF6q-7i8ClF9kAnMKgyylsC32Z8RPYwTew1cKBpurYTo8aAh2eEALw_wcB",
]
const footCaptions = [
    "Black Leather Platform Shoes",
    "Travis Scott x Air Jordans",
    "Kill Bill Shoes",
    "Big Red Boots",
    "Purple Infinite Lights Fresh Sneakers - Skechers",
]

const seedOutfitPieces = async (outfitType, username, length) => {
    for (let i = 0; i < length; i++) {
        if (outfitType === "head") {
            await storeImage(headCaptions[i], headLinks[i], "head", headImages[i], username);
        }
        if (outfitType === "body") {
            await storeImage(bodyCaptions[i], bodyLinks[i], "body", bodyImages[i], username);
        }
        if (outfitType === "leg") {
            await storeImage(legCaptions[i], legLinks[i], "leg", legImages[i], username);
        }
        if (outfitType === "foot") {
            await storeImage(footCaptions[i], footLinks[i], "foot", footImages[i], username);
        }
    }
}

await seedOutfitPieces("head", spongebob.username, 5);

const spongebobOutfitPieces = await getOutfitPiecesByUsername(spongebob.username);