chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name == "knockknock");

    port.onMessage.addListener(function(msg) {
        let messages = msg.link
        let cmPrice = msg.price
        let cmPriceFee = (+cmPrice*0.8).toFixed(2)

        fetch(`${messages}`).then(function(response) {
            return response.text();
        }).then(function(json) {

            let pricesExp = `${json}`.matchAll('class="market_listing_price market_listing_price_with_fee">\\s*.*?(\\d*,*\\d*)')
            pricesExp = Array.from(pricesExp)
            let prices = []
            let floats = []
            let floatPrice = []
            let theBest = []

            for (let price of pricesExp) {
                price = price[1]
                prices.push(`${price}`)
            }

            let re = new RegExp('"listingid":"(\\d*)".*?"id":"(\\d*)".*?review%(.*?)%.*?D(\\d*)', 'g')
            let match = `${json}`.matchAll(re)

            for (let i of match){
                let j = i.slice(1)
                fetch(`https://api.csgofloat.com/?url=steam://rungame/730/76561202255233023/+csgo_econ_action_preview%${j[2]}${j[0]}A${j[1]}D${j[3]}`).then(function(response1){
                    return response1.json()
                }).then(function(json) {
                    let j = json['iteminfo']['floatvalue']
                    floatPrice.push([j, prices.shift()])
                    if (floatPrice.length == 10){
                        theBest = [[1]]
                        for (i of Array.from(floatPrice)){
                            if (+i[1] < +cmPriceFee && i[0] < theBest[0][0]){
                                theBest[0] = i
                            }
                        }
                        port.postMessage({info: `${theBest}`})
                    }

                })
            }

        })

    });
});


