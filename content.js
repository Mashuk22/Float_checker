
// Create a button for realoding info about current weapons
let reloadButton = document.createElement("button")
reloadButton.id = "reload_button"
reloadButton.textContent = "RELOAD"
reloadButton.style.color = "#ffffff"
document.querySelector("#header_panel").appendChild(reloadButton)


let itemsList = []
document.querySelector("#reload_button").addEventListener('click',
    function () {
        itemsList = []
        let count = 0
        items = document.querySelectorAll("#main_container_bot > div.items > div.item")

        for (let item of items){

            let price = item.querySelector("div.wrapper__price > div").textContent.trim().slice(3)
            let float = item.querySelector("div.ov > div > div.ov_fls > div").textContent
            let name = item.querySelectorAll("div")[item.querySelectorAll("div").length - 1].textContent
            let cvol = item.querySelector("div.s_c > div").textContent.trim().slice(0, 2)

            if (itemsList.indexOf(`${name} ${cvol}`) == -1){
                itemsList.push(`${name} ${cvol}`)
                parseFromSteam()
            }else {
                document.querySelector("#main_container_bot > div.items").removeChild(item)
            }

            function parseFromSteam(){

                let getFromSteam = document.createElement("button")
                getFromSteam.id = `fc_get_${count}`
                count += 1
                getFromSteam.textContent = "Get From Steam"
                getFromSteam.style.color = "#ffffff"
                getFromSteam.style.backgroundColor = "green"
                getFromSteam.style.position = "absolute"
                getFromSteam.style.zIndex = 5
                item.appendChild(getFromSteam)

                item.addEventListener('contextmenu', requestToSteam)

                function requestToSteam() {
                    item.removeEventListener('contextmenu', requestToSteam)
                    let port = chrome.runtime.connect({name: "knockknock"});

                    let weaponName = name
                        .replace(/ /g, "%20")
                        .replace("|", "%7C")

                    let weaponCvol = () => {
                        if (cvol === "FN") {
                            return "Factory%20New"
                        }else if (cvol === "MW") {
                            return "Minimal%20Wear"
                        }else if (cvol === "WW"){
                            return "Well-Worn"
                        }else if (cvol === "FT") {
                            return "Field-Tested"
                        }else {
                            return "Battle-Scarred"
                        }
                    }
                    let weaponFloat = float
                    let weaponPrice = price

                    let steamLink = `https://steamcommunity.com/market/listings/730/${weaponName}%28${weaponCvol()}%29`

                    port.postMessage({link: `${steamLink}`, price: `${weaponPrice}`});
                    port.onMessage.addListener(function(msg) {
                        let steamInfo = document.createElement("p")
                        if (msg.info == 1 || msg.info.split(',')[0] - weaponFloat > 0.0065){
                            steamInfo.textContent = `Выгодных предметов\nнет`
                            steamInfo.style.color = "#ffffff"
                            steamInfo.style.position = "flex"
                            item.appendChild(steamInfo)

                            item.style.background = "#b51010"
                            item.style.filter = "alpha(Opacity=70)"
                        }else if (msg.info != 1){
                            steamInfo.textContent = `${msg.info.split(',')[0]}\n${msg.info.split(',')[1]}`
                            steamInfo.style.color = "#ffffff"
                            steamInfo.style.position = "flex"
                            item.appendChild(steamInfo)

                            item.style.background = "#10b52b"
                            item.style.filter = "alpha(Opacity=70)"
                        }

                        item.removeChild(getFromSteam)

                        runtime.Port.disconnect
                    })



                }



            }


        }

    })


