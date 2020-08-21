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
            let getFromSteam = document.createElement("button")
            getFromSteam.id = `fc_get_${count}`
            count += 1
            getFromSteam.textContent = "Get From Steam"
            getFromSteam.style.color = "#ffffff"
            getFromSteam.style.backgroundColor = "green"
            getFromSteam.style.position = "absolute"
            getFromSteam.style.zIndex = 5
            item.appendChild(getFromSteam)
            item.addEventListener('contextmenu',
                function () {
                    let weaponName = itemsList[item.getAttribute("pos")][0]
                        .replace(/ /g, "%20")
                        .replace("|", "%7C")

                    let weaponCvol = () => {
                        let cvol = itemsList[item.getAttribute("pos")][1]
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
                    let weaponFloat = itemsList[item.getAttribute("pos")][2]
                    let weaponPrice = itemsList[item.getAttribute("pos")][3]

                    console.log(`https://steamcommunity.com/market/listings/730/${weaponName}%28${weaponCvol()}%29`)
                    console.log(itemsList[item.getAttribute("pos")])
                })

            let price = item.querySelector("div.wrapper__price > div").textContent.trim().slice(3)
            let float = item.querySelector("div.ov > div > div.ov_fls > div").textContent
            let name = item.querySelectorAll("div")[item.querySelectorAll("div").length - 1].textContent
            let cvol = item.querySelector("div.s_c > div").textContent.trim().slice(0, 2)
            itemsList.push([name, cvol, float, price])
        }

    })
